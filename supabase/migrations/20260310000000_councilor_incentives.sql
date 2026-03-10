-- 1. Create councilor_levels table
CREATE TABLE IF NOT EXISTS public.councilor_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_name TEXT NOT NULL,
    basic_salary NUMERIC DEFAULT 0,
    target_amount NUMERIC DEFAULT 0,
    incentive_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE public.councilor_levels ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read levels
CREATE POLICY "Allow read access to authenticated users for councilor levels" 
ON public.councilor_levels FOR SELECT TO authenticated USING (true);

-- Allow admins/hr to modify levels
CREATE POLICY "Allow admin to manage councilor levels" 
ON public.councilor_levels FOR ALL TO authenticated 
USING (auth.jwt() ->> 'role' IN ('super_admin', 'hr'));


-- 2. Create councilor_profiles to link users to levels
CREATE TABLE IF NOT EXISTS public.councilor_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    level_id UUID REFERENCES public.councilor_levels(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE public.councilor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users for councilor profiles" 
ON public.councilor_profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin to manage councilor profiles" 
ON public.councilor_profiles FOR ALL TO authenticated 
USING (auth.jwt() ->> 'role' IN ('super_admin', 'hr', 'counselor_head'));

-- 3. Initial Configuration Seed Data (Optional)
-- Since UUIDs are auto-generated, we don't have conflict checks on level_name easily without a unique constraint.
-- Let's just create them without ON CONFLICT DO NOTHING, assuming this runs once.
INSERT INTO public.councilor_levels (level_name, basic_salary, target_amount, incentive_percentage)
VALUES 
    ('Level 1', 8000, 88000, 9.1),
    ('Level 2', 10000, 88000, 11.4),
    ('Level 3', 15000, 115000, 13);
