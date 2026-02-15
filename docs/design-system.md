# EHMS – Design System

> Feels like a calm operations control room — structured, reassuring, and quietly powerful.
> This system handles finance, payroll, and academic verification. It must **reduce anxiety — not create it**.

---

## 1. Color Palette

### Primary

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1E3A8A` | Headers, primary actions, active nav |
| Soft Background | `#F8FAFC` | Page background |
| Surface White | `#FFFFFF` | Cards, modals |

### Secondary

| Token | Hex | Usage |
|-------|-----|-------|
| Muted Slate | `#64748B` | Secondary text, labels |
| Light Divider | `#E2E8F0` | Borders, dividers |

### Status

| Status | Hex | Usage |
|--------|-----|-------|
| Success | `#16A34A` | Approved, verified, paid |
| Warning | `#F59E0B` | Pending, attention needed |
| Danger | `#DC2626` | Rejected, failed (soft, never aggressive) |
| Info | `#2563EB` | Informational banners |

### Semantic Rules
- Finance pages: slightly **darker** header tone
- Academic pages: **lighter**, calmer background
- Payroll approval: subtle **green glow**
- Rejected sessions: soft red background — never aggressive
- **Contrast ratio**: always ≥ 4.5:1 (AA+)

---

## 2. Typography

Modern geometric sans-serif. Modular scale **1.25**.

| Level | Size | Weight | Use |
|-------|------|--------|-----|
| H1 | 32px | 600 | Page title |
| H2 | 24px | 600 | Section headers |
| H3 | 20px | 500 | Card titles |
| H4 | 16px | 500 | Subsections |
| Body | 14px | 400 | Primary text |
| Caption | 12px | 400 | Metadata |

**Rules:**
- Line-height ≥ 1.6
- Max 70 characters per line
- Avoid ALL CAPS except small status tags
- AA+ contrast (4.5:1 minimum)

---

## 3. Spacing & Layout

**Grid:** 8pt base unit.

| Scale | Size | Use |
|-------|------|-----|
| Tight | 8px | Inline spacing |
| Standard | 16px | Form fields, paragraphs |
| Section | 24px | Card padding, section gaps |
| Major | 32px | Major separations |
| Page | 48px | Page-level breathing space |

**Component Rules:**
- Card padding: 24px
- Form field spacing: 16px vertical
- Button padding: 12px vertical
- Table header spacing: 48px

**Breakpoints:**
- Mobile-first
- Tablet: collapse sidebar
- Desktop: persistent sidebar

Offer **"Compact Mode"** toggle for power users on data-heavy tables.

---

## 4. Motion & Interaction

**Emotion:** Gentle. Predictable. Forgiving.

| Animation | Duration | Easing |
|-----------|----------|--------|
| Micro-interactions | 150–200ms | ease-out |
| Modal open | 220ms | ease-out |
| Page transition | 250ms | fade + slide |
| Success confirmation | 200ms | spring |

**Examples:**
- Approve payroll → soft green checkmark fade
- Session verified → subtle glow on row
- Error → small shake + clear explanation (not red explosion)

**Empty States:**
- "No sessions yet. Once teachers mark sessions, they appear here."
- "No leads assigned. You're clear for now."

---

## 5. Voice & Tone

**Keywords:** Calm, Professional, Supportive, Clear, Respectful

| Context | Example |
|---------|---------|
| Onboarding | "Welcome back. Let's take it one step at a time." |
| Success | "Payroll cycle approved successfully." |
| Error | "This action requires finance verification before continuing." |

**Never:** sarcasm, emojis, corporate buzzwords, blame the user.
- ❌ "Invalid data."
- ✅ "We couldn't verify this entry. Please check session time."

---

## 6. Layout Patterns

**Style References:** Linear, Apple HIG, shadcn/ui

| Pattern | Usage |
|---------|-------|
| Left sidebar | Primary navigation |
| Top breadcrumb | Location context |
| Card-based sections | Content grouping |
| Sticky action bar | Approval pages |

**Ownership Indicator** (on every record):
- Owner role badge
- Status chip
- Last updated timestamp

---

## 7. Accessibility

- Semantic headings (H1–H4)
- Keyboard navigation (every table row accessible)
- Focus ring: 2px blue outline
- ARIA roles on status tags
- Screen-reader labels on finance buttons
- All interactive states visually distinct

---

## 8. Quality Checklists

### Emotional Audit (Before shipping any screen)
- [ ] Does this reduce cognitive load?
- [ ] Is ownership clear?
- [ ] Does error messaging guide instead of blame?
- [ ] Would this feel manageable during payroll week stress?
- [ ] Is finance presented with authority but not aggression?

### Technical QA
- [ ] Typography follows modular scale
- [ ] 8pt grid adhered to
- [ ] Contrast ≥ AA+
- [ ] Interactive states visible
- [ ] Motion 150–300ms
- [ ] No dense wall-of-data screens
- [ ] Approval buttons clearly separated from navigation
