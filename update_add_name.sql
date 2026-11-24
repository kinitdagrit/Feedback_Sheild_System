-- PARA SA NAA NAY feedback_shield NGA DATABASE (daan nga tables)
-- I-run lang KAUSA. Kung mo-error nga "Duplicate column", naa na ang user_name.
USE feedback_shield;
ALTER TABLE users ADD COLUMN user_name VARCHAR(100) NOT NULL DEFAULT '' AFTER user_code;
ALTER TABLE comments ADD COLUMN user_name VARCHAR(100) NOT NULL DEFAULT '' AFTER user_code;
