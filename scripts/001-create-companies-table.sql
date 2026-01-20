-- Create companies table for storing company information
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  website TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on company name for faster searches
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_companies_source ON companies(source);
