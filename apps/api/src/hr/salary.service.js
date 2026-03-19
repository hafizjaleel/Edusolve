/**
 * Salary Service — Dynamic teacher salary calculation
 *
 * Rate resolution priority (strict order):
 *   1. Teacher custom_rates for subject + level
 *   2. Special subject rates (French, Abacus) — board/experience independent
 *   3. ICSE/IGCSE board rates — experience independent
 *   4. State/CBSE rates by experience category
 *
 * Levels derived from student class_level:
 *   LKG–7   → 'lkg_7'
 *   8–10    → 'class_8_10'
 *   +1 & +2 → 'plus_1_2'
 */

import { getSupabaseAdminClient } from '../config/supabase.js';

// ═══════ LEVEL MAPPING ═══════

const CLASS_TO_LEVEL = {};

// LKG through 7
['lkg', 'ukg', 'nursery', 'kg', 'pre-kg'].forEach(c => { CLASS_TO_LEVEL[c.toLowerCase()] = 'lkg_7'; });
for (let i = 1; i <= 7; i++) {
  CLASS_TO_LEVEL[String(i)] = 'lkg_7';
  CLASS_TO_LEVEL[`class ${i}`] = 'lkg_7';
  CLASS_TO_LEVEL[`class-${i}`] = 'lkg_7';
  CLASS_TO_LEVEL[`grade ${i}`] = 'lkg_7';
}
// 8 through 10
for (let i = 8; i <= 10; i++) {
  CLASS_TO_LEVEL[String(i)] = 'class_8_10';
  CLASS_TO_LEVEL[`class ${i}`] = 'class_8_10';
  CLASS_TO_LEVEL[`class-${i}`] = 'class_8_10';
  CLASS_TO_LEVEL[`grade ${i}`] = 'class_8_10';
}
// +1, +2, 11, 12
['+1', '+2', '11', '12', 'class 11', 'class 12', 'class-11', 'class-12', 'grade 11', 'grade 12', 'plus one', 'plus two', 'plus 1', 'plus 2'].forEach(c => {
  CLASS_TO_LEVEL[c.toLowerCase()] = 'plus_1_2';
});

/**
 * Derive salary level enum from a student's class_level string
 */
export function classToLevel(classLevel) {
  if (!classLevel) return 'lkg_7';
  const key = String(classLevel).trim().toLowerCase();
  if (CLASS_TO_LEVEL[key]) return CLASS_TO_LEVEL[key];
  // Try numeric extraction
  const num = parseInt(key.replace(/\D/g, ''), 10);
  if (!isNaN(num)) {
    if (num <= 7) return 'lkg_7';
    if (num <= 10) return 'class_8_10';
    return 'plus_1_2';
  }
  return 'lkg_7'; // default
}

// ═══════ SUBJECT NORMALIZATION ═══════

const SPECIAL_SUBJECTS = ['french', 'abacus'];

function normalizeSubject(subject) {
  if (!subject) return '_default';
  const s = subject.trim().toLowerCase();
  if (SPECIAL_SUBJECTS.includes(s)) return s;
  return '_default';
}

// ═══════ BOARD NORMALIZATION ═══════

function normalizeBoard(board) {
  if (!board) return 'state_cbse';
  const b = board.trim().toLowerCase();
  if (['icse', 'igcse', 'isce', 'ib'].includes(b)) return 'icse_igcse';
  return 'state_cbse'; // State, CBSE, and any other board defaults to state_cbse
}

// ═══════ HARDCODED FALLBACK RATES ═══════

const FALLBACK_RATES = {
  state_cbse: {
    experienced_high: { lkg_7: 120, class_8_10: 130, plus_1_2: 170 },
    experienced:      { lkg_7: 110, class_8_10: 120, plus_1_2: 160 },
    fresher:          { lkg_7: 100, class_8_10: 110, plus_1_2: 150 },
  },
  icse_igcse: {
    _any: { lkg_7: 120, class_8_10: 125, plus_1_2: 160 },
  },
  _special: {
    french: { lkg_7: 230, class_8_10: 240, plus_1_2: 260 },
    abacus: { lkg_7: 130, class_8_10: 140, plus_1_2: 150 },
  }
};

// ═══════ RATE CONFIG CACHE ═══════

let rateConfigCache = null;
let rateConfigFetchedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getRateConfig() {
  const now = Date.now();
  if (rateConfigCache && (now - rateConfigFetchedAt) < CACHE_TTL_MS) {
    return rateConfigCache;
  }

  const adminClient = getSupabaseAdminClient();
  const { data, error } = await adminClient
    .from('salary_rate_config')
    .select('board, experience_category, subject_key, level, rate');

  if (error || !data || data.length === 0) {
    // Fall back to hardcoded
    return null;
  }

  // Build lookup: config[board][experience][subjectKey][level] = rate
  const config = {};
  data.forEach(row => {
    if (!config[row.board]) config[row.board] = {};
    if (!config[row.board][row.experience_category]) config[row.board][row.experience_category] = {};
    if (!config[row.board][row.experience_category][row.subject_key]) config[row.board][row.experience_category][row.subject_key] = {};
    config[row.board][row.experience_category][row.subject_key][row.level] = Number(row.rate);
  });

  rateConfigCache = config;
  rateConfigFetchedAt = now;
  return config;
}

// ═══════ RATE RESOLUTION ═══════

/**
 * Resolve the per-hour rate for a given teacher + session combination.
 *
 * @param {Object} teacher - { experience_level, custom_rates }
 * @param {string} board - student's board (e.g. 'State', 'CBSE', 'ICSE', 'IGCSE')
 * @param {string} subject - raw subject string
 * @param {string} level   - 'lkg_7' | 'class_8_10' | 'plus_1_2'
 * @param {Object|null} config - rate config from DB (or null to use fallback)
 * @returns {number} rate per hour
 */
export function getRate(teacher, board, subject, level, config) {
  const subjectKey = normalizeSubject(subject);
  const normalizedBoard = normalizeBoard(board);
  const experience = teacher.experience_level || 'fresher';

  // Priority 1: Teacher custom_rates override
  // Check compound key "subject__board" first, then fallbacks including _any
  if (teacher.custom_rates && typeof teacher.custom_rates === 'object') {
    const subLower = subject?.trim().toLowerCase() || '_default';
    const boardLower = board?.trim().toLowerCase() || '_any';

    const keysToTry = [
      `${subLower}__${boardLower}`, // 1. Exact Subject + Exact Board
      `${subLower}___any`,          // 2. Exact Subject + Any Board
      subLower,                     // 3. Exact Subject (legacy)
      subjectKey,                   // 4. Exact Subject Normalized (legacy)
      `_any__${boardLower}`,        // 5. Any Subject, Exact Board
      `_any___any`,                 // 6. Any Subject, Any Board
    ];

    for (const key of keysToTry) {
      if (!key) continue;
      const match = teacher.custom_rates[key];
      if (match && match[level] !== undefined) {
        return Number(match[level]);
      }
    }
  }

  // Priority 2: Special subjects (French, Abacus) — board & experience independent
  if (SPECIAL_SUBJECTS.includes(subjectKey)) {
    if (config) {
      const rate = config['_any']?.['_any']?.[subjectKey]?.[level];
      if (rate !== undefined) return rate;
    }
    return FALLBACK_RATES._special[subjectKey]?.[level] || 0;
  }

  // Priority 3: ICSE/IGCSE — experience independent
  if (normalizedBoard === 'icse_igcse') {
    if (config) {
      const rate = config['icse_igcse']?.['_any']?.['_default']?.[level];
      if (rate !== undefined) return rate;
    }
    return FALLBACK_RATES.icse_igcse._any[level] || 0;
  }

  // Priority 4: State/CBSE by experience category
  if (config) {
    const rate = config['state_cbse']?.[experience]?.['_default']?.[level];
    if (rate !== undefined) return rate;
  }
  return FALLBACK_RATES.state_cbse[experience]?.[level] || FALLBACK_RATES.state_cbse.fresher[level] || 0;
}

// ═══════ MONTHLY SALARY CALCULATION ═══════

/**
 * Calculate monthly salary for all active teachers.
 *
 * @param {number} month - 1-12
 * @param {number} year
 * @returns {Array} report items
 */
export async function calculateAllTeacherSalaries(month, year) {
  const adminClient = getSupabaseAdminClient();
  const config = await getRateConfig();

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

  // Fetch active teachers
  const { data: teachers, error: tErr } = await adminClient
    .from('teacher_profiles')
    .select('*, users!teacher_profiles_user_id_fkey(id, email, full_name, phone)')
    .eq('is_in_pool', true);

  if (tErr) throw new Error(tErr.message);

  // Fetch approved sessions with their student class_level and board
  const { data: verifications, error: vErr } = await adminClient
    .from('session_verifications')
    .select('session_id, academic_sessions!inner(id, teacher_id, duration_hours, session_date, subject, students(class_level, board))')
    .eq('type', 'approval')
    .eq('status', 'approved');

  if (vErr) throw new Error(vErr.message);

  // Filter sessions to the target month
  const sessionsByTeacher = {};
  (verifications || []).forEach(sv => {
    const sess = sv.academic_sessions;
    if (!sess || !sess.teacher_id) return;
    if (sess.session_date < startDate || sess.session_date > endDate) return;

    if (!sessionsByTeacher[sess.teacher_id]) sessionsByTeacher[sess.teacher_id] = [];
    sessionsByTeacher[sess.teacher_id].push({
      duration_hours: Number(sess.duration_hours || 0),
      subject: sess.subject || '_default',
      class_level: sess.students?.class_level || '',
      board: sess.students?.board || ''
    });
  });

  // Build report
  const report = (teachers || []).map(t => {
    const sessions = sessionsByTeacher[t.user_id] || [];
    let totalHours = 0;
    let totalSalary = 0;
    const breakdownBySubject = {};
    const breakdownByLevel = {};

    sessions.forEach(sess => {
      const level = classToLevel(sess.class_level);
      const rate = getRate(t, sess.board, sess.subject, level, config);
      const hours = sess.duration_hours;
      const amount = Math.round(hours * rate * 100) / 100;

      totalHours += hours;
      totalSalary += amount;

      // Subject breakdown
      const subKey = sess.subject || 'General';
      if (!breakdownBySubject[subKey]) breakdownBySubject[subKey] = { hours: 0, amount: 0 };
      breakdownBySubject[subKey].hours += hours;
      breakdownBySubject[subKey].amount += amount;

      // Level breakdown
      if (!breakdownByLevel[level]) breakdownByLevel[level] = { hours: 0, amount: 0 };
      breakdownByLevel[level].hours += hours;
      breakdownByLevel[level].amount += amount;
    });

    return {
      id: t.id,
      user_id: t.user_id,
      full_name: t.users?.full_name || 'Unknown',
      email: t.users?.email || '',
      teacher_code: t.teacher_code,
      experience_level: t.experience_level || 'fresher',
      total_hours: Math.round(totalHours * 100) / 100,
      total_salary: Math.round(totalSalary * 100) / 100,
      breakdown_by_subject: breakdownBySubject,
      breakdown_by_level: breakdownByLevel
    };
  });

  return report;
}
