-- Insert sample companies
INSERT INTO companies (name, city, state, website, source) VALUES
  ('TechCorp', 'San Francisco', 'CA', 'https://techcorp.com', 'manual'),
  ('DataSystems Inc', 'New York', 'NY', 'https://datasystems.com', 'greenhouse'),
  ('CloudStart', 'Austin', 'TX', 'https://cloudstart.io', 'lever'),
  ('AI Innovations', 'Seattle', 'WA', 'https://aiinnovations.com', 'rss')
ON CONFLICT (id) DO NOTHING;

-- Insert sample jobs (using subqueries to get company IDs)
INSERT INTO jobs (company_id, title, location, posted_at, url, source, tags, status, notes)
SELECT 
  c.id,
  'Senior Full Stack Engineer',
  'San Francisco, CA',
  NOW() - INTERVAL '2 days',
  'https://techcorp.com/careers/senior-fullstack',
  'greenhouse',
  ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
  'Applied',
  'Submitted application on company website'
FROM companies c WHERE c.name = 'TechCorp'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (company_id, title, location, posted_at, url, source, tags, status, notes)
SELECT 
  c.id,
  'Data Engineer',
  'New York, NY',
  NOW() - INTERVAL '5 days',
  'https://datasystems.com/jobs/data-engineer',
  'lever',
  ARRAY['Python', 'SQL', 'Apache Spark', 'AWS'],
  'Saved',
  'Looks promising, need to tailor resume'
FROM companies c WHERE c.name = 'DataSystems Inc'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (company_id, title, location, posted_at, url, source, tags, status, notes)
SELECT 
  c.id,
  'DevOps Engineer',
  'Austin, TX',
  NOW() - INTERVAL '1 day',
  'https://cloudstart.io/careers/devops',
  'manual',
  ARRAY['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
  'Interviewing',
  'Phone screen scheduled for next week'
FROM companies c WHERE c.name = 'CloudStart'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (company_id, title, location, posted_at, url, source, tags, status, notes)
SELECT 
  c.id,
  'Machine Learning Engineer',
  'Seattle, WA',
  NOW() - INTERVAL '7 days',
  'https://aiinnovations.com/careers/ml-engineer',
  'rss',
  ARRAY['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
  'Saved',
  'Very competitive, need to prepare ML case study'
FROM companies c WHERE c.name = 'AI Innovations'
ON CONFLICT (id) DO NOTHING;
