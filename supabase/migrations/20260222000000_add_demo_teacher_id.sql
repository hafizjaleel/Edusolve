ALTER TABLE leads ADD COLUMN IF NOT EXISTS demo_teacher_id UUID REFERENCES teacher_profiles(id);
