
-- Assigner le rôle admin à l'utilisateur madum
-- D'abord, nous devons trouver l'ID de l'utilisateur madum et lui assigner le rôle admin
-- Remplacez 'madum@email.com' par l'email exact de madum si différent

INSERT INTO public.user_roles (user_id, role)
SELECT 
  profiles.id,
  'admin'::app_role
FROM public.profiles 
WHERE profiles.email LIKE '%madum%' 
  OR profiles.name ILIKE '%madum%'
  OR profiles.first_name ILIKE '%madum%'
  OR profiles.last_name ILIKE '%madum%'
ON CONFLICT (user_id, role) DO NOTHING;

-- Si l'email exact de madum est connu, vous pouvez utiliser cette requête à la place :
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role 
-- FROM public.profiles 
-- WHERE email = 'email-exact-de-madum@domain.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
