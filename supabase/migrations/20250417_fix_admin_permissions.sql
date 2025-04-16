
-- First, ensure we have proper RLS policies for administrators to manage profiles
-- Allow administrators to perform all operations on profiles
CREATE POLICY "Administrators can do everything on profiles" 
ON public.profiles
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow administrators to do everything on courses
CREATE POLICY "Administrators can do everything on courses" 
ON public.courses
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow administrators to do everything on grades
CREATE POLICY "Administrators can do everything on grades" 
ON public.grades
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow administrators to do everything on events
CREATE POLICY "Administrators can do everything on events" 
ON public.events
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow administrators to do everything on notifications
CREATE POLICY "Administrators can do everything on notifications" 
ON public.notifications
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create a specific policy to allow students to view notifications
CREATE POLICY "Students can view notifications" 
ON public.notifications
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student' AND
  (audience = 'all' OR audience = (SELECT COALESCE(department, 'all') FROM public.profiles WHERE id = auth.uid()))
);

-- Function to check if the user is a student
CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if the user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
