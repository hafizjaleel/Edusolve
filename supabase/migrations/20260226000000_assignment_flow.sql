
-- Add day, time, and status to student_teacher_assignments
-- Default status to 'accepted' to maintain compatibility with existing records
ALTER TABLE student_teacher_assignments
ADD COLUMN IF NOT EXISTS day TEXT,
ADD COLUMN IF NOT EXISTS time TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'accepted';

-- Add a check constraint for valid status values
ALTER TABLE student_teacher_assignments 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted'));
