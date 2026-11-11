ALTER TABLE app_users ALTER COLUMN password_hash TYPE VARCHAR(255);
ALTER TABLE app_users ALTER COLUMN recovery_code_hash TYPE VARCHAR(255);
