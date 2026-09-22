insert into partners (id, name, kind, expertise, district, capacity) values
  ('p1', 'BIT Mesra', 'university', 'civil,water,infrastructure', 'Ranchi', 8),
  ('p2', 'NIT Jamshedpur', 'university', 'infrastructure,sanitation,energy', 'East Singhbhum', 6),
  ('p3', 'IIT (ISM) Dhanbad', 'university', 'environment,water,mining', 'Dhanbad', 6),
  ('p4', 'Ranchi University', 'university', 'education,livelihood,social', 'Ranchi', 10),
  ('p5', 'XLRI Jamshedpur', 'university', 'csr,livelihood,governance', 'East Singhbhum', 4),
  ('p6', 'BIT Sindri', 'university', 'engineering,energy,infrastructure', 'Dhanbad', 5),
  ('p7', 'Tata Steel CSR', 'industry', 'water,sanitation,infrastructure', 'East Singhbhum', 12),
  ('p8', 'Jharkhand Jal Jeevan Mission', 'govt', 'water', 'Ranchi', 20)
on conflict (id) do nothing;

insert into problems (
  id, title, summary, category, subcategory, priority, locality, district,
  lat, lng, status, report_count, required_expertise, fingerprint, confidence, created_at, updated_at
) values
  (
    'pr-handpump-ward4',
    'Broken handpump beside Ward 4 school',
    'The community handpump next to the government school in Ward 4 has not yielded water for over a week. Multiple households and school children now walk farther for drinking water.',
    'water', 'handpump', 'high', 'Ward 4', 'Ranchi',
    23.3441, 85.3096, 'open', 17, 'civil,water',
    'handpump broken ward 4 school ranchi water', 0.92,
    now() - interval '6 days', now() - interval '1 day'
  ),
  (
    'pr-garbage-hatia',
    'Open garbage dump beside Hatia station road',
    'Household waste is accumulating along the station approach road. Stray animals scatter the pile and monsoon runoff is carrying it into the drain.',
    'sanitation', 'solid-waste', 'high', 'Hatia', 'Ranchi',
    23.3142, 85.3089, 'in_progress', 9, 'sanitation,civil',
    'garbage dump hatia station waste ranchi', 0.88,
    now() - interval '8 days', now() - interval '12 hours'
  ),
  (
    'pr-school-roof-khunti',
    'Leaking classroom roof at Khunti middle school',
    'Rainwater enters two classrooms during storms. Attendance drops on wet days and textbooks are being damaged.',
    'education', 'school-infrastructure', 'high', 'Khunti town', 'Khunti',
    23.0754, 85.2780, 'open', 6, 'civil,education',
    'school roof leak khunti classroom rain', 0.9,
    now() - interval '11 days', now() - interval '2 days'
  ),
  (
    'pr-streetlight-dhurwa',
    'Streetlights out on Dhurwa market stretch',
    'A 400 metre stretch near the evening market has had no working streetlights for three weeks. Residents report safety concerns after dusk.',
    'infrastructure', 'streetlight', 'medium', 'Dhurwa', 'Ranchi',
    23.3148, 85.2445, 'assigned', 11, 'electrical,infrastructure',
    'streetlight dark dhurwa market ranchi', 0.86,
    now() - interval '21 days', now() - interval '3 days'
  ),
  (
    'pr-drain-jamshedpur',
    'Open drain overflow in Bistupur lane',
    'The covered drain has collapsed in two places. Stagnant water sits against shopfronts and the smell is affecting the lane throughout the day.',
    'sanitation', 'drainage', 'high', 'Bistupur', 'East Singhbhum',
    22.8046, 86.2029, 'open', 14, 'civil,sanitation',
    'open drain overflow bistupur jamshedpur', 0.91,
    now() - interval '4 days', now() - interval '8 hours'
  ),
  (
    'pr-anganwadi-water',
    'Anganwadi without drinking water, Bundu block',
    'The Anganwadi centre has had dry taps for a fortnight. Midday meals and child attendance are both affected.',
    'health', 'anganwadi', 'high', 'Bundu', 'Ranchi',
    23.1632, 85.5934, 'open', 5, 'water,health,civil',
    'anganwadi drinking water bundu ranchi', 0.87,
    now() - interval '14 days', now() - interval '4 days'
  ),
  (
    'pr-potholes-nh',
    'Deep potholes on Ranchi–Khunti feeder road',
    'A 1.2 km stretch has potholes large enough to damage two-wheelers. School buses slow to walking pace and two minor accidents were reported this month.',
    'infrastructure', 'road', 'medium', 'Namkum', 'Ranchi',
    23.3470, 85.3760, 'open', 22, 'civil,infrastructure',
    'potholes ranchi khunti road namkum', 0.84,
    now() - interval '18 days', now() - interval '2 days'
  ),
  (
    'pr-textbooks-santhal',
    'Missing mother-tongue primers in Dumka primary school',
    'Class 1–2 children who speak Santhali at home have no primers. Teachers are translating Hindi textbooks orally, which slows foundational literacy.',
    'education', 'learning-materials', 'medium', 'Dumka', 'Dumka',
    24.2676, 87.2497, 'open', 4, 'education,language',
    'santhali primers textbooks dumka primary school', 0.8,
    now() - interval '9 days', now() - interval '5 days'
  )
on conflict (id) do nothing;

insert into reports (
  id, user_id, problem_id, source, raw_text, structured_title, structured_summary,
  category, locality, district, processing_status, relationship_type, relationship_confidence, created_at
) values
  ('r1', 'catalog', 'pr-handpump-ward4', 'whatsapp', 'Handpump broken beside Ward 4 school, no water since last Monday.', 'Broken handpump beside Ward 4 school', 'Handpump next to the school is dry.', 'water', 'Ward 4', 'Ranchi', 'processed', 'same', 0.94, now() - interval '6 days'),
  ('r2', 'catalog', 'pr-handpump-ward4', 'web', 'Water pump not working near school in Ward 4.', 'Water pump not working near school', 'Pump near school is not working.', 'water', 'Ward 4', 'Ranchi', 'processed', 'same', 0.91, now() - interval '5 days'),
  ('r3', 'catalog', 'pr-handpump-ward4', 'whatsapp', 'No water from pump at Ward 4. Children going to next mohalla.', 'No water from pump at Ward 4', 'Residents walking farther for water.', 'water', 'Ward 4', 'Ranchi', 'processed', 'same', 0.9, now() - interval '4 days'),
  ('r4', 'catalog', 'pr-garbage-hatia', 'web', 'Huge garbage pile on the road to Hatia station. Dogs tearing bags.', 'Garbage pile on Hatia station road', 'Waste accumulating on station approach.', 'sanitation', 'Hatia', 'Ranchi', 'processed', 'same', 0.89, now() - interval '8 days'),
  ('r5', 'catalog', 'pr-school-roof-khunti', 'whatsapp', 'School roof leaking in Khunti, two rooms cannot be used in rain.', 'Leaking classroom roof at Khunti school', 'Rain enters two classrooms.', 'education', 'Khunti town', 'Khunti', 'processed', 'same', 0.92, now() - interval '11 days'),
  ('r6', 'catalog', 'pr-drain-jamshedpur', 'web', 'Drain broken in Bistupur lane, water sitting outside shops.', 'Open drain overflow in Bistupur', 'Collapsed drain flooding the lane.', 'sanitation', 'Bistupur', 'East Singhbhum', 'processed', 'same', 0.9, now() - interval '4 days'),
  ('r7', 'catalog', 'pr-potholes-nh', 'web', 'Terrible potholes on the feeder road after Namkum. Bike almost fell.', 'Deep potholes on Namkum feeder road', 'Unsafe potholes on school-bus route.', 'infrastructure', 'Namkum', 'Ranchi', 'processed', 'same', 0.85, now() - interval '18 days'),
  ('r8', 'catalog', 'pr-streetlight-dhurwa', 'whatsapp', 'No lights in Dhurwa market at night. Women not comfortable returning.', 'Streetlights out on Dhurwa market stretch', 'Dark market road after dusk.', 'infrastructure', 'Dhurwa', 'Ranchi', 'processed', 'same', 0.86, now() - interval '21 days')
on conflict (id) do nothing;

insert into status_events (id, problem_id, actor_user_id, kind, note, created_at) values
  ('e1', 'pr-handpump-ward4', 'catalog', 'problem.created', 'Master challenge opened from first citizen report.', now() - interval '6 days'),
  ('e2', 'pr-handpump-ward4', 'catalog', 'reports.consolidated', 'Additional citizen reports attached as evidence.', now() - interval '4 days'),
  ('e3', 'pr-garbage-hatia', 'catalog', 'officer.accepted', 'Sanitation inspector accepted the assignment.', now() - interval '2 days'),
  ('e4', 'pr-garbage-hatia', 'catalog', 'in_progress', 'Clearance crew scheduled.', now() - interval '12 hours'),
  ('e5', 'pr-streetlight-dhurwa', 'catalog', 'assigned', 'Routed to electrical maintenance wing.', now() - interval '3 days')
on conflict (id) do nothing;
