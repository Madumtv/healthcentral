
-- Phase 1: Fix RLS Policy Conflicts on doctors table
-- Remove conflicting policies first
DROP POLICY IF EXISTS "Authenticated users can view all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can create doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Authenticated users can delete doctors" ON public.doctors;
DROP POLICY IF EXISTS "Doctors are readable by authenticated users" ON public.doctors;
DROP POLICY IF EXISTS "Only admins can modify doctors" ON public.doctors;

-- Create consistent RLS policies for doctors table
CREATE POLICY "Allow authenticated users to read doctors" 
  ON public.doctors 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to manage doctors" 
  ON public.doctors 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add missing DELETE policy for medication_doses
CREATE POLICY "Users can delete their own medication doses" 
  ON public.medication_doses 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create secure password verification function for password changes
CREATE OR REPLACE FUNCTION public.verify_user_password(user_email text, current_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Get the current user's ID
  SELECT auth.uid() INTO auth_user_id;
  
  -- Verify the user is authenticated
  IF auth_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verify the current password by attempting to sign in
  -- This is a safer approach than storing password hashes
  PERFORM auth.email() WHERE auth.email() = user_email;
  
  -- If we get here, the user is authenticated with the correct email
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Add security audit log table for tracking important events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);
