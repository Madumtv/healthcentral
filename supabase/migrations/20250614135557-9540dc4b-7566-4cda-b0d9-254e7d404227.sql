
-- Table pour stocker les informations des médicaments de l'API FAGG-AFMPS
CREATE TABLE public.medication_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnk TEXT UNIQUE NOT NULL, -- Code National/Nationaal Code
  name TEXT NOT NULL,
  company TEXT,
  category TEXT, -- Forme pharmaceutique (comprimé, gélule, etc.)
  atc_code TEXT, -- Code ATC (Anatomical Therapeutic Chemical)
  delivery_status TEXT,
  prescription_type TEXT,
  pack_size TEXT,
  public_price DECIMAL(10,2),
  reimbursement_code TEXT,
  reimbursement_rate TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour stocker la composition des médicaments
CREATE TABLE public.medication_composition (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnk TEXT NOT NULL,
  active_substance TEXT NOT NULL,
  strength TEXT,
  unit TEXT DEFAULT 'mg',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (cnk) REFERENCES public.medication_info(cnk) ON DELETE CASCADE
);

-- Table pour stocker les présentations alternatives d'un médicament
CREATE TABLE public.medication_presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnk TEXT NOT NULL,
  presentation_cnk TEXT NOT NULL,
  name TEXT NOT NULL,
  pack_size TEXT,
  public_price DECIMAL(10,2),
  reimbursement_code TEXT,
  reimbursement_rate TEXT,
  delivery_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (cnk) REFERENCES public.medication_info(cnk) ON DELETE CASCADE
);

-- Ajouter une référence vers medication_info dans la table medications existante
ALTER TABLE public.medications 
ADD COLUMN medication_info_cnk TEXT REFERENCES public.medication_info(cnk);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_medication_info_name ON public.medication_info USING gin(to_tsvector('french', name));
CREATE INDEX idx_medication_info_cnk ON public.medication_info(cnk);
CREATE INDEX idx_medication_info_company ON public.medication_info(company);
CREATE INDEX idx_medication_composition_cnk ON public.medication_composition(cnk);
CREATE INDEX idx_medication_composition_substance ON public.medication_composition USING gin(to_tsvector('french', active_substance));

-- Améliorer les index de recherche pour les médecins
CREATE INDEX idx_doctors_search ON public.doctors USING gin(
  to_tsvector('french', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(specialty, '') || ' ' || 
    COALESCE(city, '')
  )
);

-- Enable RLS sur les nouvelles tables
ALTER TABLE public.medication_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_presentations ENABLE ROW LEVEL SECURITY;

-- Policies pour permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Medication info readable by authenticated users" 
  ON public.medication_info 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Medication composition readable by authenticated users" 
  ON public.medication_composition 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Medication presentations readable by authenticated users" 
  ON public.medication_presentations 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Policies pour permettre l'écriture aux admins uniquement
CREATE POLICY "Only admins can modify medication info" 
  ON public.medication_info 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify medication composition" 
  ON public.medication_composition 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify medication presentations" 
  ON public.medication_presentations 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
