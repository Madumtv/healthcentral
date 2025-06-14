
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Authenticated users can view all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can create doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can delete doctors" ON public.doctors;

-- Create new policies with clear names
CREATE POLICY "Allow authenticated users to read all doctors" 
  ON public.doctors 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create doctors" 
  ON public.doctors 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to modify doctors" 
  ON public.doctors 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to remove doctors" 
  ON public.doctors 
  FOR DELETE 
  TO authenticated
  USING (true);
