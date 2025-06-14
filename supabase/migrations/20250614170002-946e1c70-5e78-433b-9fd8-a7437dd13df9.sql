
-- Activer Row Level Security sur la table doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs authentifiés de voir tous les médecins
CREATE POLICY "Authenticated users can view all doctors" 
  ON public.doctors 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de créer des médecins
CREATE POLICY "Authenticated users can create doctors" 
  ON public.doctors 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de modifier des médecins
CREATE POLICY "Authenticated users can update doctors" 
  ON public.doctors 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Politique pour permettre à tous les utilisateurs authentifiés de supprimer des médecins
CREATE POLICY "Authenticated users can delete doctors" 
  ON public.doctors 
  FOR DELETE 
  TO authenticated 
  USING (true);
