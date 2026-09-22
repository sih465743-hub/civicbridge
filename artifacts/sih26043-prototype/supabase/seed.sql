-- Seed data for demo / SIH presentation
-- Run after schema.sql

INSERT INTO partners (name, type, expertise_tags, capacity, reputation_score, contact_email, is_active) VALUES
('IIT Delhi', 'university', ARRAY['infrastructure', 'water', 'environment'], 8, 0.92, 'innovation@iitd.ac.in', true),
('IIT Bombay', 'university', ARRAY['water', 'agriculture', 'health'], 7, 0.90, 'societal@iitb.ac.in', true),
('AIIMS Delhi', 'university', ARRAY['health'], 5, 0.95, 'community@aiims.edu', true),
('Tata Consultancy Services', 'industry', ARRAY['infrastructure', 'education', 'other'], 12, 0.85, 'csr@tcs.com', true),
('Reliance Foundation', 'industry', ARRAY['agriculture', 'water', 'education'], 10, 0.88, 'foundation@ril.com', true),
('Banaras Hindu University', 'university', ARRAY['agriculture', 'environment', 'education'], 6, 0.80, 'outreach@bhu.ac.in', true),
('NIT Trichy', 'university', ARRAY['infrastructure', 'environment'], 5, 0.78, 'innovation@nitt.edu', true),
('Infosys Foundation', 'industry', ARRAY['education', 'health', 'other'], 9, 0.82, 'foundation@infosys.com', true);

-- Optional: add a couple of sample challenges so dashboard is not empty on first load
-- (You can delete these after live testing)
