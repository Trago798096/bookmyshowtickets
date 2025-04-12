-- Add auth_id column to admin_users table
ALTER TABLE admin_users
ADD COLUMN auth_id UUID REFERENCES auth.users(id),
ADD COLUMN email TEXT UNIQUE;

-- Update existing admin user with auth_id
UPDATE admin_users
SET email = 'admin@example.com'
WHERE username = 'admin'; 