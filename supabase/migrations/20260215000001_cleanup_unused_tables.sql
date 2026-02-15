-- Cleanup unused tables detected in analysis
-- These tables were identified as legacy/unused in the codebase analysis

-- 1. Demo Teacher Responses (Legacy broadcast system)
DROP TABLE IF EXISTS demo_teacher_responses;

-- 2. Demo Sessions (Legacy, replaced by academic_sessions / lead status)
DROP TABLE IF EXISTS demo_sessions;

-- 3. Teacher Interviews (Legacy, replaced by teacher_leads pipeline)
DROP TABLE IF EXISTS teacher_interviews;

-- 4. Ownership Transfers (Legacy, covered by audit_logs and lead_status_history)
DROP TABLE IF EXISTS ownership_transfers;
