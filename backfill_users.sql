-- Backfill existing users from auth.users to public.users
INSERT INTO public.users (id, name, email)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email;
