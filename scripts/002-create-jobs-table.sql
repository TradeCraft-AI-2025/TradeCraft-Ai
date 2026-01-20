-- Create jobs table for tracking job applications
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  posted_at TIMESTAMPTZ,
  url TEXT,
  source TEXT CHECK (source IN ('greenhouse', 'lever', 'rss', 'manual')),
  tags TEXT[],
  status TEXT DEFAULT 'Saved' CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Ghosted', 'Offer')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on posted_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);

-- Create GIN index on tags array for efficient tag searches
CREATE INDEX IF NOT EXISTS idx_jobs_tags ON jobs USING GIN(tags);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Create index on company_id for joins
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
