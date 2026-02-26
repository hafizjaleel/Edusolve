-- Backfill existing teacher profiles with data from teacher_leads
-- This script updates teacher_profiles for leads that have already been converted.

UPDATE teacher_profiles tp
SET
  phone = tl.phone,
  qualification = tl.qualification,
  experience_duration = tl.experience_duration,
  experience_type = tl.experience_type,
  place = tl.place,
  city = tl.city,
  communication_level = tl.communication_level,
  account_holder_name = tl.account_holder_name,
  account_number = tl.account_number,
  ifsc_code = tl.ifsc_code,
  gpay_holder_name = tl.gpay_holder_name,
  gpay_number = tl.gpay_number,
  upi_id = tl.upi_id,
  
  -- Handle Array/JSONB conversion
  -- Attempting to cast JSONB source to whatever the target column type is (JSONB or TEXT[])
  -- If target is TEXT[], this subquery logic constructs a proper array.
  -- If target is JSONB, you might need to simpler assignment: subjects_taught = tl.subjects
  
  -- Logic for TEXT[] target (robust extraction):
  -- 1. If it's a JSON array, extract elements.
  -- 2. If it's a scalar (string), treat as single element array.
  -- 3. If null/empty, empty array.
  
  subjects_taught = ARRAY(
    SELECT value
    FROM jsonb_array_elements_text(
      CASE 
        WHEN jsonb_typeof(tl.subjects) = 'array' THEN tl.subjects
        WHEN jsonb_typeof(tl.subjects) = 'string' THEN jsonb_build_array(tl.subjects)
        ELSE '[]'::jsonb 
      END
    )
  )::text[],
  
  syllabus = ARRAY(
    SELECT value
    FROM jsonb_array_elements_text(
      CASE 
        WHEN jsonb_typeof(tl.boards) = 'array' THEN tl.boards
        WHEN jsonb_typeof(tl.boards) = 'string' THEN jsonb_build_array(tl.boards)
        ELSE '[]'::jsonb 
      END
    )
  )::text[],
  
  languages = ARRAY(
    SELECT value
    FROM jsonb_array_elements_text(
      CASE 
        WHEN jsonb_typeof(tl.mediums) = 'array' THEN tl.mediums
        WHEN jsonb_typeof(tl.mediums) = 'string' THEN jsonb_build_array(tl.mediums)
        ELSE '[]'::jsonb 
      END
    )
  )::text[]

FROM teacher_leads tl
WHERE tp.id = tl.converted_teacher_id
  -- Only update records that seem incomplete (e.g., missing phone) to avoid overwriting newer manual edits
  AND (tp.phone IS NULL OR tp.phone = '');
