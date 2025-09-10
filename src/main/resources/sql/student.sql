-- Enable the pg_trgm extension for faster LIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a GIN index for Full-Text Search on the 'name' column
CREATE INDEX idx_students_name_fts ON students USING GIN (to_tsvector('simple', name));

-- Create a GIN index for Full-Text Search on the 'email' column
CREATE INDEX idx_students_email_fts ON students USING GIN (to_tsvector('simple', email));

-- Optional: Create a GiST index for faster LIKE/ILIKE on name
CREATE INDEX idx_students_name_trgm ON students USING GIST (name gist_trgm_ops);
