
-- Create doctors table with Belgian medical data
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inami_number TEXT UNIQUE, -- Numéro INAMI/RIZIV unique
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add doctor_id to medications table
ALTER TABLE public.medications 
ADD COLUMN doctor_id UUID REFERENCES public.doctors(id);

-- Create index for faster searches
CREATE INDEX idx_doctors_name ON public.doctors(last_name, first_name);
CREATE INDEX idx_doctors_inami ON public.doctors(inami_number);
CREATE INDEX idx_doctors_specialty ON public.doctors(specialty);

-- Enable RLS on doctors table
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policy for doctors - readable by all authenticated users
CREATE POLICY "Doctors are readable by authenticated users" 
  ON public.doctors 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Only allow admins to modify doctors data
CREATE POLICY "Only admins can modify doctors" 
  ON public.doctors 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
