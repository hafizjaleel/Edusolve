-- Change student_status enum to only: active, vacation, inactive
-- Step 1: Convert column to text first (so we can set any value)
ALTER TABLE students ALTER COLUMN status DROP DEFAULT;
ALTER TABLE students ALTER COLUMN status TYPE text USING status::text;

-- Step 2: Update old values to the new 'inactive'
UPDATE students SET status = 'inactive' WHERE status IN ('dropped', 'completed');

-- Step 3: Drop old enum, create new one, convert column back
DROP TYPE student_status;
CREATE TYPE student_status AS ENUM ('active', 'vacation', 'inactive');
ALTER TABLE students ALTER COLUMN status TYPE student_status USING status::student_status;
ALTER TABLE students ALTER COLUMN status SET DEFAULT 'active';
