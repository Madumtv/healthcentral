-- Assigner le rôle admin à l'utilisateur marin.dumont@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT 
  profiles.id,
  'admin'::app_role
FROM public.profiles 
WHERE profiles.email = 'marin.dumont@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;