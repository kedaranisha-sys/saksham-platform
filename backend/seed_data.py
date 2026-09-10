import sqlite3
import json
from config import Config
from database import get_db_connection

def seed_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data
    tables = [
        'users', 'profiles', 'jobs', 'applications', 'courses',
        'government_schemes', 'legal_resources', 'support_locations',
        'mentors', 'mentor_requests', 'community_posts', 'community_comments',
        'community_reports', 'saved_resources', 'notifications'
    ]
    for table in tables:
        cursor.execute(f"DELETE FROM {table}")

    # 1. Users
    users_data = [
        (
            'user-seeker-1',
            'aarav@saksham.org',
            'pbkdf2:demo_hash_aarav',
            'Aarav Sharma',
            0,
            None,
            'user',
            'New Delhi, India',
            'Aspiring professional eager to build a career in customer support and tech skills.'
        ),
        (
            'user-seeker-anon',
            'anon@saksham.org',
            'pbkdf2:demo_hash_anon',
            'SakshamMember_204',
            1,
            'SakshamMember_204',
            'user',
            'Bengaluru, India',
            'Prefer to explore opportunities anonymously while transitioning.'
        ),
        (
            'user-employer-1',
            'priya@inclusivecorp.com',
            'pbkdf2:demo_hash_employer',
            'Priya Nair',
            0,
            None,
            'employer',
            'Mumbai, India',
            'Head of Diversity & Talent Acquisition at Inclusive Innovations Corp.'
        ),
        (
            'user-mentor-1',
            'kavya@techleaders.org',
            'pbkdf2:demo_hash_mentor',
            'Kavya Sen',
            0,
            None,
            'mentor',
            'Bengaluru, India',
            'Senior Software Engineer & LGBTQ+ advocate helping trans youth enter tech.'
        ),
        (
            'user-admin-1',
            'admin@saksham.org',
            'pbkdf2:demo_hash_admin',
            'Dr. Maya Patil',
            0,
            None,
            'admin',
            'New Delhi, India',
            'Platform Administrator & Legal Rights Specialist.'
        )
    ]
    cursor.executemany(
        '''INSERT INTO users (id, email, password_hash, preferred_name, is_anonymous, anonymous_handle, role, location, bio)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        users_data
    )

    # 2. Profiles
    profiles_data = [
        (
            'user-seeker-1',
            json.dumps(['Employment', 'Skill development', 'Government schemes', 'Mentorship']),
            json.dumps(['Tailoring', 'Computer skills', 'Customer Support', 'Data Entry', 'Communication']),
            'Entry-level',
            'Higher Secondary (12th)',
            'Full-time',
            json.dumps({'email_notifications': True, 'job_alerts': True, 'mentor_alerts': True})
        ),
        (
            'user-seeker-anon',
            json.dumps(['Skill development', 'Legal assistance', 'Healthcare resources']),
            json.dumps(['Graphic design', 'Digital marketing']),
            'Intermediate',
            'Bachelor degree',
            'Remote',
            json.dumps({'email_notifications': False, 'job_alerts': False})
        )
    ]
    cursor.executemany(
        '''INSERT INTO profiles (user_id, seeking_goals, skills, experience_level, education, preferred_job_type, notification_preferences)
           VALUES (?, ?, ?, ?, ?, ?, ?)''',
        profiles_data
    )

    # 3. Jobs
    jobs_data = [
        (
            'job-1',
            'Customer Support Executive (Voice & Digital)',
            'user-employer-1',
            'Aegis Inclusive Solutions',
            'New Delhi, Delhi',
            0,
            'Full-time',
            'Entry-level (0-1 years)',
            '₹22,000 - ₹28,000 / month',
            json.dumps(['Customer Support', 'Communication', 'Computer skills', 'English']),
            'Join our inclusive front-line team managing customer inquiries across email, chat, and phone channels. Complete training provided.',
            'Basic computer proficiency, good conversational communication, empathetic attitude. High school pass or equivalent.',
            'Comprehensive health insurance including gender affirmation benefits, gender-neutral restrooms, transport facility, mentor pairing.',
            1,
            json.dumps(['Equal Opportunity Employer', 'Gender Affirmation Leave', 'Inclusive Health Insurance', 'Sensitized Workplace Training']),
            'active'
        ),
        (
            'job-2',
            'Apparel Pattern & Tailoring Associate',
            'user-employer-1',
            'FabCraft Handlooms & Apparel',
            'Bengaluru, Karnataka',
            0,
            'Full-time',
            '1-3 years',
            '₹20,000 - ₹26,000 / month',
            json.dumps(['Tailoring', 'Embroidery', 'Garment Construction', 'Pattern Making']),
            'Work with our sustainable apparel design studio creating handloom garments. Opportunity to lead small stitching batches and train apprentices.',
            'Hands-on experience in garment stitching, pattern cutting, machine operation. Portfolio or practical test required.',
            'Day shift only, subsidized cafeteria, safe transport allowance, annual performance bonus.',
            1,
            json.dumps(['Zero Discrimination Policy', 'Safe Changing & Restroom Facilities', 'Skill Upgrade Workshops']),
            'active'
        ),
        (
            'job-3',
            'Junior Front-End Web Developer',
            'user-employer-1',
            'Inklusion Digital Labs',
            'Remote (India)',
            1,
            'Full-time',
            'Entry-level (0-2 years)',
            '₹35,000 - ₹50,000 / month',
            json.dumps(['Programming', 'React', 'HTML/CSS', 'JavaScript', 'Computer skills']),
            'Build accessible, responsive web interfaces for social-impact platforms. Mentorship provided by senior queer and allied tech leaders.',
            'Strong understanding of HTML, CSS, JavaScript, and modern React. Familiarity with Git version control.',
            '100% remote flexibility, home office setup stipend, mental health counseling support, medical insurance.',
            1,
            json.dumps(['100% Remote Option', 'Affinity Employee Resource Groups', 'Mental Health Support Program']),
            'active'
        ),
        (
            'job-4',
            'Office Administration & Data Associate',
            'user-employer-1',
            'Tata Community Initiatives Trust',
            'Mumbai, Maharashtra',
            0,
            'Full-time',
            'Entry-level',
            '₹24,000 - ₹30,000 / month',
            json.dumps(['Data Entry', 'Computer skills', 'MS Office', 'Documentation']),
            'Manage day-to-day administrative documentation, spreadsheet record maintenance, and logistics coordination for CSR community programs.',
            'Comfortable with MS Excel, typing speed 30+ WPM, attention to detail, graduation or 12th pass with diploma.',
            'Group medical cover, Provident Fund, subsidized lunch, supportive mentoring.',
            1,
            json.dumps(['Affirmative Action Employer', 'Internal Complaints Committee Diversity Rep', 'Sensitized Staff']),
            'active'
        ),
        (
            'job-5',
            'Hospitality & Guest Experience Trainee',
            'user-employer-1',
            'Lemon Tree Hotels',
            'Gurugram, Haryana',
            0,
            'Full-time',
            'Entry-level (No prior experience needed)',
            '₹18,000 - ₹24,000 / month + Tips',
            json.dumps(['Hospitality', 'Customer Support', 'Communication', 'Cooking']),
            'Lemon Tree Hotels is proud of its pioneer role in employing Persons with Disabilities and Transgender individuals. Comprehensive on-job training provided across front desk and food services.',
            'Warm, welcoming demeanor, willingness to learn hospitality standards.',
            'Duty meals, accommodation assistance, ESI/PF, clear career progression to supervisor levels.',
            1,
            json.dumps(['Pioneer Inclusive Employer', 'Dedicated DEI Officer', 'Gender Transition Support Guidelines']),
            'active'
        ),
        (
            'job-6',
            'Beauty & Wellness Specialist',
            'user-employer-1',
            'Naturals Inclusive Salon Network',
            'Hyderabad, Telangana',
            0,
            'Full-time',
            '1-2 years',
            '₹22,000 - ₹32,000 / month',
            json.dumps(['Beauty services', 'Skin Care', 'Hair Styling', 'Customer Support']),
            'Deliver premium salon and spa services in an upscale, respectful salon branch. Specialized training on bridal and modern styling included.',
            'Certification or practical experience in salon/spa techniques. Good customer manners.',
            'Commission on services, product sales incentives, safe travel allowance for evening shifts.',
            1,
            json.dumps(['Safe Environment', 'Strict Anti-Harassment Enforcement', 'Equal Compensation Matrix']),
            'active'
        ),
        (
            'job-7',
            'Graphic Design & Social Media Intern',
            'user-employer-1',
            'EqualRights Media Collective',
            'Remote (India)',
            1,
            'Internship',
            'Entry-level',
            '₹15,000 / month stipend',
            json.dumps(['Graphic design', 'Marketing', 'Canva', 'Social Media', 'Creative Writing']),
            'Create engaging visual graphics, social media posts, and short video reels highlighting community stories and empowerment initiatives.',
            'Proficiency in Canva, Adobe Photoshop, or Figma. Eye for color, layout, and storytelling.',
            'Flexible working hours, letter of recommendation, opportunity for full-time conversion.',
            1,
            json.dumps(['Queer-Led Organization', 'Creative Freedom', 'Mentorship Program']),
            'active'
        ),
        (
            'job-8',
            'Quality Assurance & Testing Associate',
            'user-employer-1',
            'TechMahindra DEI Alliance',
            'Pune, Maharashtra',
            0,
            'Full-time',
            'Entry-level (0-1 years)',
            '₹28,000 - ₹36,000 / month',
            json.dumps(['Computer skills', 'Programming', 'Testing', 'Attention to Detail']),
            'Execute manual and automated test scripts for enterprise mobile and web software. Work alongside supportive development squads.',
            'BCA, B.Sc Computer Science, or verified coding boot camp completion.',
            'Comprehensive health coverage for self and partner, cab service, continuous technical learning sponsor.',
            1,
            json.dumps(['Sensitization Workshops', 'Partner Insurance Benefits', 'Gender Neutral Policies']),
            'active'
        )
    ]
    cursor.executemany(
        '''INSERT INTO jobs (id, title, employer_id, employer_name, location, is_remote, job_type, experience_level, salary_range, skills_required, description, requirements, benefits, is_inclusive_workplace, inclusive_policies, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        jobs_data
    )

    # 4. Courses & Vocational Resources
    courses_data = [
        (
            'course-1',
            'Digital Literacy & Workplace Software Essentials',
            'Foundational 6-week program covering Windows, MS Excel, Google Workspace, email etiquette, and cyber hygiene for modern office jobs.',
            'Digital literacy',
            'National Institute of Electronics & IT (NIELIT)',
            '6 Weeks (4 hrs/week)',
            'Free',
            1,
            'Online',
            'Beginner',
            'https://www.nielit.gov.in',
            'Open to all transgender individuals. No prior computer experience needed.',
            1
        ),
        (
            'course-2',
            'Commercial Garment Making & Pattern Cutting',
            'Comprehensive vocational training on commercial sewing machines, pattern drafting, tailoring measurements, and fabric cutting for fashion industry jobs.',
            'Tailoring',
            'National Skill Development Corporation (NSDC)',
            '3 Months (Full-time)',
            'Free',
            1,
            'Offline',
            'Beginner to Intermediate',
            'https://www.nsdcindia.org',
            'Open to all candidates. Tool kit and stipend provided under government skill missions.',
            1
        ),
        (
            'course-3',
            'Full-Stack Web Development Bootcamp',
            'Intensive, project-driven curriculum teaching HTML5, CSS3, JavaScript ES6+, React, and backend API integration with career placement support.',
            'Programming',
            'Saksham Tech Academy & FreeCodeCamp',
            '12 Weeks (Self-paced + Live Mentorship)',
            'Free',
            1,
            'Online',
            'Beginner',
            'https://www.freecodecamp.org',
            'Access to a laptop/computer and internet connection. Basic English reading.',
            1
        ),
        (
            'course-4',
            'Beauty & Wellness Professional Certification',
            'Learn skin care routines, facial treatments, hair styling, bridal makeup, and salon hygiene under certified industry practitioners.',
            'Beauty services',
            'Beauty & Wellness Sector Skill Council',
            '2 Months (Mon-Fri)',
            'Free (SMILE Scheme sponsored)',
            1,
            'Offline',
            'Beginner',
            'https://bwssc.in',
            'Transgender applicants eligible for 100% fee waiver and daily conveyance allowance.',
            1
        ),
        (
            'course-5',
            'BPO & Customer Experience Specialist',
            'Voice modulation, accent neutralization, chat support tools, ticketing systems, and active listening skills for domestic and international BPO roles.',
            'Communication',
            'NASSCOM Foundation Skill Hub',
            '4 Weeks (Intensive)',
            'Free',
            1,
            'Hybrid',
            'Beginner',
            'https://nasscomfoundation.org',
            '10th or 12th pass. Willingness to communicate in English and regional languages.',
            1
        ),
        (
            'course-6',
            'Micro-Business Entrepreneurship & Financial Literacy',
            'How to write a business plan, apply for MUDRA/SMILE loans, manage cash flow, register GST/Udyam, and market products locally and on Instagram.',
            'Entrepreneurship',
            'Entrepreneurship Development Institute of India (EDII)',
            '4 Weeks (Weekend batch)',
            'Free',
            1,
            'Online',
            'Beginner',
            'https://www.ediiindia.org',
            'Anyone with a business idea or existing craft/tailoring skill.',
            1
        ),
        (
            'course-7',
            'Artisanal Handicrafts & Textile Printing',
            'Traditional block printing, tie-dye, bag making, and souvenir craft production with direct linkage to rural artisan exhibitions and e-commerce platforms.',
            'Craft',
            'Khadi & Village Industries Commission (KVIC)',
            '6 Weeks',
            'Free',
            1,
            'Offline',
            'Beginner',
            'https://www.kvic.gov.in',
            'Open to all interested community artisans.',
            1
        ),
        (
            'course-8',
            'Commercial Baking & Pastry Production',
            'Hands-on bakery training: breads, cakes, cookies, food safety hygiene (FSSAI guidelines), and packaging for retail or cloud kitchens.',
            'Cooking',
            'Tourism and Hospitality Skill Council',
            '8 Weeks',
            'Free',
            1,
            'Offline',
            'Beginner',
            'https://thsc.in',
            'Basic interest in cooking and food service.',
            1
        )
    ]
    cursor.executemany(
        '''INSERT INTO courses (id, title, description, skill_category, provider, duration, cost, is_free, mode, level, link, eligibility, is_verified)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        courses_data
    )

    # 5. Government Schemes (Authentic Indian Policies)
    schemes_data = [
        (
            'scheme-smile',
            'SMILE Scheme (Support for Marginalized Individuals for Livelihood and Enterprise)',
            'Ministry of Social Justice and Empowerment, Government of India',
            'Skill development',
            'An umbrella scheme providing comprehensive welfare measures for transgender persons, including skill development training, scholarships, medical packages, shelter homes, and support for micro-enterprises.',
            'Any transgender individual holding a National Transgender Certificate or valid declaration.',
            '1. Skill development training with stipend of ₹1,000/month.\n2. Composite medical health package up to ₹5 Lakh/year under PM-JAY.\n3. Safe shelter at Garima Greh with food and clothing.\n4. Support for livelihood generation.',
            json.dumps(['Transgender Certificate / TG ID Card (or application receipt)', 'Aadhaar Card', 'Bank Account details', 'Passport-size photographs']),
            'Step 1: Obtain your Transgender Certificate from the National Portal for Transgender Persons (transgender.dosje.gov.in).\nStep 2: Log into the SMILE portal or visit your District Social Welfare Office / nearest Garima Greh.\nStep 3: Select the component (Skill Training / Scholarship / Healthcare).\nStep 4: Submit documents for verification. Sanction is directly credited to your Aadhaar-linked bank account.',
            'https://transgender.dosje.gov.in/smile/',
            '2026-06-15',
            1,
            0
        ),
        (
            'scheme-tg-portal',
            'National Portal for Transgender Persons – Identity Card & Certificate',
            'Ministry of Social Justice and Empowerment, Government of India',
            'Identity/documentation',
            'Official online end-to-end digital portal allowing transgender individuals across India to apply for and receive an official Transgender Certificate and Identity Card issued by District Magistrates without physical visit or mandatory medical examination.',
            'Any person whose gender does not match the sex assigned at birth and who self-identifies as transgender under the Transgender Persons (Protection of Rights) Act, 2019.',
            '1. Legally recognized national Identity Card accepted across all government departments, banks, railways, and passport offices.\n2. Mandatory document to unlock all central and state welfare benefits under SMILE.\n3. Right to self-perceived gender identity without mandatory physical inspection.',
            json.dumps(['Affidavit declaring gender identity in prescribed format (Annexure-II of 2020 Rules)', 'Any existing ID (Aadhaar, Voter ID, Ration Card, or PAN)', 'Passport-size photograph']),
            'Step 1: Visit https://transgender.dosje.gov.in and click "Register Here".\nStep 2: Upload your self-declaration affidavit and basic ID proof.\nStep 3: Track application status online. District Magistrate office verifies within 30 days.\nStep 4: Download your digital Transgender Certificate and Identity Card with QR code directly from the portal.',
            'https://transgender.dosje.gov.in',
            '2026-07-10',
            1,
            0
        ),
        (
            'scheme-garima-greh',
            'Garima Greh: Shelter Homes for Transgender Persons',
            'National Institute of Social Defence (NISD) & MoSJE',
            'Housing',
            'Safe, institutional residential shelter homes set up across major cities in India specifically for transgender persons in destitution, crisis, or facing domestic rejection. Provides dignified living, food, medical care, and vocational skill training.',
            'Transgender persons in distress, experiencing homelessness, domestic estrangement, or needing safe interim accommodation while seeking employment.',
            '1. Safe shelter, nutrition, and clothing free of cost.\n2. Primary healthcare and psychological counseling.\n3. Linkage to skill training programs and employment placement.\n4. Legal aid assistance.',
            json.dumps(['Transgender ID Card or self-declaration', 'Any photo identity proof (if available; non-possession will not deny immediate shelter)']),
            'Step 1: Contact the nearest Garima Greh directly or call the National Transgender Helpline (1800-200-1122).\nStep 2: In-person intake and basic verification.\nStep 3: Safe accommodation allocated with personal bed, storage, and daily meals.',
            'https://transgender.dosje.gov.in/GarimaGreh',
            '2026-05-20',
            1,
            0
        ),
        (
            'scheme-ayushman-tg',
            'Ayushman Bharat TG Plus Health Package (PM-JAY)',
            'National Health Authority (NHA) & Ministry of Social Justice',
            'Healthcare',
            'A landmark composite health package dedicated for transgender individuals. Provides comprehensive cashless health coverage up to ₹5,00,000 per year per beneficiary across empaneled public and private hospitals, including general treatments and specific gender-affirmation procedures.',
            'Transgender persons holding a valid Transgender Certificate issued via the National Portal.',
            '1. Cashless hospitalization coverage of ₹5 Lakh per year.\n2. Covers pre-existing illnesses, inpatient consultations, diagnostic tests, surgeries, and medicines.\n3. Specialized package includes gender-affirmation procedures and hormone therapy in authorized centers.',
            json.dumps(['National Transgender Certificate / TG ID Card', 'Aadhaar Card', 'Mobile number linked to Aadhaar']),
            'Step 1: Ensure your Transgender Certificate is generated from transgender.dosje.gov.in.\nStep 2: Visit any Ayushman Mitra desk at an empaneled hospital or Common Service Centre (CSC).\nStep 3: Complete e-KYC using your TG Certificate number and Aadhaar.\nStep 4: Receive your Ayushman Bharat TG Plus Golden Card.',
            'https://pmjay.gov.in',
            '2026-08-01',
            1,
            0
        ),
        (
            'scheme-pmkvy-special',
            'PMKVY Special Projects for Transgender Skill Training',
            'Ministry of Skill Development & Entrepreneurship (MSDE)',
            'Skill development',
            'Customized, fully funded vocational skill development initiatives implemented under Pradhan Mantri Kaushal Vikas Yojana through specialized centers, ensuring dignified learning environments with post-placement tracking.',
            'Transgender youth aged 18-35 years, irrespective of formal educational qualification.',
            '1. 100% free skill training aligned to National Skills Qualifications Framework (NSQF).\n2. Monthly conveyance and lunch allowance during training.\n3. Government-recognized skill certification and job fair placement assistance.',
            json.dumps(['Transgender ID or Self-Declaration', 'Aadhaar Card', 'Bank Passbook copy', '2 passport photos']),
            'Step 1: Browse active training partners on skillindia.gov.in or contact your District Skill Development Officer (DSDO).\nStep 2: Enroll in preferred sector (Retail, Apparel, IT-ITeS, Hospitality, Beauty).\nStep 3: Complete training and practical assessment.\nStep 4: Participate in campus placement drives.',
            'https://www.skillindia.gov.in',
            '2026-04-12',
            1,
            0
        ),
        (
            'scheme-nbcfdc-loan',
            'NBCFDC / NSFDC Concessional Micro-Finance & Loan Scheme',
            'National Backward Classes Finance & Development Corporation',
            'Financial assistance',
            'Provides term loans and micro-credit financing at heavily subsidized interest rates (4% to 6% per annum) to transgender entrepreneurs for establishing self-employment ventures in retail, services, tailoring, transport, and agriculture.',
            'Transgender persons wishing to start or expand a micro-enterprise, holding TG ID card and viable business plan.',
            '1. Term loans up to ₹5,00,000 for individual projects.\n2. Low interest rate of 4-6% p.a.\n3. Capital subsidy support of up to 33% of project cost under select state channelizing agencies.\n4. Repayment period up to 5 years with moratorium period.',
            json.dumps(['Transgender ID Card', 'Detailed Project Report (Business Plan)', 'Address Proof & Aadhaar', 'Quotation for equipment/machinery to be purchased']),
            'Step 1: Prepare a basic business project report (you can use Saksham Business Hub AI Generator).\nStep 2: Apply through the State Channelizing Agency (SCA) of NBCFDC or nominated regional rural banks.\nStep 3: Loan appraisal by bank committee.\nStep 4: Sanction and disbursement directly to equipment vendors or business account.',
            'https://www.nbcfdc.gov.in',
            '2026-03-30',
            1,
            0
        ),
        (
            'scheme-scholarships',
            'National Scholarships for Transgender Students',
            'Ministry of Social Justice and Empowerment',
            'Education',
            'Financial assistance provided to transgender students pursuing secondary education (Class IX-X), senior secondary (Class XI-XII), and undergraduate/postgraduate degree courses to arrest dropout rates and encourage higher learning.',
            'Transgender students enrolled in recognized government or government-aided schools, colleges, and universities.',
            '1. Monthly stipend ranging from ₹1,000 to ₹1,800/month.\n2. Annual contingency grant for books and study materials.\n3. Full tuition fee reimbursement for government colleges.',
            json.dumps(['Transgender Certificate or bona-fide certificate from educational institution', 'Previous year marksheet', 'Fee receipt from recognized school/college', 'Bank Account details in student name']),
            'Step 1: Visit National Scholarship Portal (scholarships.gov.in).\nStep 2: Select Ministry of Social Justice & Empowerment -> Scholarships for Transgender Students.\nStep 3: Submit application with student bona-fide and marksheet.\nStep 4: Institution verifies application; scholarship is transferred via Direct Benefit Transfer (DBT).',
            'https://scholarships.gov.in',
            '2026-06-01',
            1,
            0
        )
    ]
    cursor.executemany(
        '''INSERT INTO government_schemes (id, name, provider, category, description, eligibility, benefits, required_documents, application_procedure, official_url, last_verified_date, is_verified, is_demo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        schemes_data
    )

    # 6. Legal Resources (Based on NALSA 2014 & 2019 Transgender Persons Act)
    legal_data = [
        (
            'legal-workplace',
            'Workplace Discrimination & Unfair Termination Protection',
            'Employment discrimination',
            'An employer refuses to hire you, denies promotion, withholds equal pay, terminates your contract, or subjects you to hostile workplace conditions due to your transgender identity.',
            'Section 3(b) and Section 9 of the Transgender Persons (Protection of Rights) Act, 2019 strictly prohibit discrimination against any transgender person in employment matters, including recruitment, promotion, and employment terms. Every establishment with 100+ employees is required to designate a Complaint Officer to resolve complaints.',
            json.dumps([
                'Document every incident in writing with dates, times, witnesses, emails, or chat logs.',
                'Submit a formal written complaint to the Internal Complaints Committee (ICC) or the designated Complaint Officer of your employer.',
                'The Complaint Officer must complete an inquiry within 15 days of receiving the grievance under the 2020 Rules.',
                'If the employer fails to redress the issue, file a formal complaint before the District Magistrate (under Section 11 of the Act) or the State Human Rights Commission (SHRC).',
                'You may approach the District Legal Services Authority (DLSA) for free legal representation under the Legal Services Authorities Act, 1987.'
            ]),
            json.dumps([
                {'name': 'National Transgender Legal Aid Helpline', 'contact': '1800-200-1122'},
                {'name': 'National Legal Services Authority (NALSA)', 'contact': '15100 / https://nalsa.gov.in'},
                {'name': 'Human Rights Law Network (HRLN)', 'contact': '+91-11-24374501'}
            ]),
            'Transgender Persons (Protection of Rights) Act, 2019 (Sections 3, 9, 11); Transgender Persons (Protection of Rights) Rules, 2020; NALSA vs. Union of India (2014) 5 SCC 438.',
            'This information is provided for general educational purposes and does not constitute professional legal advice. For active legal representation, connect with an empaneled legal aid advocate.'
        ),
        (
            'legal-identity-change',
            'Right to Self-Perceived Gender Identity (No Mandatory Medical Tests)',
            'Identity/documentation',
            'Authorities, schools, banks, or employers demand physical examination, psychological evaluation, or sex reassignment surgery (SRS) certificates before issuing identity documents in your preferred name and gender.',
            'The Supreme Court of India in NALSA (2014) and Sections 4, 5, and 6 of the 2019 Act recognized the fundamental constitutional right to self-identification of gender as male, female, or transgender. Under Rule 3 of the 2020 Rules, no physical medical examination can be demanded for issuing a Transgender Certificate.',
            json.dumps([
                'Submit an affidavit in Form-2 stating your self-identified gender on the National Portal for Transgender Persons (transgender.dosje.gov.in).',
                'If an official insists on physical medical inspection, quote Rule 3(2) of Transgender Persons Rules, 2020 which explicitly forbids invasive examinations.',
                'Once your Transgender Certificate is generated, use it to update name and gender on Aadhaar, PAN, Passport, and Voter ID.',
                'If an application is unlawfully rejected by the District Magistrate, an appeal can be filed under Section 7 of the Act before the Appellate Authority / High Court.'
            ]),
            json.dumps([
                {'name': 'National Portal Helpdesk', 'contact': 'tgportal-msje@gov.in'},
                {'name': 'DLSA Legal Clinics', 'contact': 'Toll-free 15100'}
            ]),
            'Articles 14, 15, 19, and 21 of the Constitution of India; NALSA vs. UOI (2014); Transgender Persons Rules, 2020 (Rule 3 & 4).',
            'This guide is strictly educational. Always verify administrative procedures on the official portal.'
        ),
        (
            'legal-housing',
            'Housing & Tenancy Discrimination Protection',
            'Housing',
            'Landlords or resident welfare associations (RWAs) refuse rental housing, cancel rental agreements abruptly, or demand exorbitant security deposits solely upon discovering your gender identity.',
            'Section 3(c) of the Transgender Persons Act, 2019 prohibits the denial, termination, or unfair treatment regarding the right to reside, purchase, rent, or occupy any property. Depriving a person of housing based on gender identity violates Article 15 and 21 of the Constitution.',
            json.dumps([
                'Ensure you hold a registered rental agreement with clear clause terms.',
                'If faced with sudden illegal eviction threats, immediately dial 112 for police protection against unlawful trespass and physical intimidation.',
                'File a written complaint of discrimination with the local police station and District Magistrate citing Section 3(c) of the 2019 Act.',
                'Contact local verified LGBTQ+ shelters or Garima Greh if interim emergency shelter is needed.'
            ]),
            json.dumps([
                {'name': 'National Transgender Helpline', 'contact': '1800-200-1122'},
                {'name': 'Police Emergency Helpline', 'contact': '112'}
            ]),
            'Section 3(c), Transgender Persons (Protection of Rights) Act, 2019; Constitution of India Article 21 (Right to Shelter).',
            'Educational guidance only. Seek counsel from a local legal aid lawyer for lease disputes.'
        ),
        (
            'legal-police-harassment',
            'Protection Against Harassment, Extortion & Police Misconduct',
            'Violence/harassment',
            'Harassment, unlawful detention, verbal abuse, invasive body searches, or extortion by law enforcement personnel or vigilante groups in public spaces.',
            'Section 18(d) of the 2019 Act makes harming or endangering the life, safety, health, or well-being (mental or physical) of a transgender person a punishable criminal offense. Arbitrary detention without FIR violates the Code of Criminal Procedure (CrPC/BNSS). Transgender individuals cannot be subjected to strip searches or degrading treatment.',
            json.dumps([
                'Stay calm and politely request the badge number, name, and police station of the officer.',
                'Remember: You have the right to know the legal reason for questioning or detention.',
                'Immediately inform a trusted contact or NGO helpline via the Saksham Quick Alert / Emergency button.',
                'If subjected to abuse, file an immediate complaint with the Police Complaints Authority (PCA), the Superintendent of Police (SP), or the National Human Rights Commission (NHRC).',
                'Free legal assistance is guaranteed through the Legal Services Authority.'
            ]),
            json.dumps([
                {'name': 'Emergency Police Helpline', 'contact': '112'},
                {'name': 'Tele-MANAS Mental Health Support', 'contact': '14416'},
                {'name': 'National Human Rights Commission (NHRC)', 'contact': '144333 / https://nhrc.nic.in'}
            ]),
            'Section 18, Transgender Persons (Protection of Rights) Act, 2019; Supreme Court Guidelines in DK Basu vs. State of West Bengal.',
            'In immediate physical danger, contact emergency services at 112.'
        ),
        (
            'legal-education',
            'Right to Equal Education & Protection from Campus Bullying',
            'Education',
            'Educational institutions denying admission, refusing to record preferred name/gender, or failing to protect students from ragging, bullying, and institutional harassment.',
            'Section 3(a) and Section 8 of the 2019 Act mandate that every educational institution funded or recognized by the government must provide inclusive education, sports, and recreation facilities without discrimination. UGC guidelines mandate anti-discrimination cells in all colleges.',
            json.dumps([
                'Submit your National Transgender Identity Card to the admissions/registrar office for official student record correction.',
                'Submit an anti-ragging and anti-harassment complaint to the college Internal Anti-Ragging Squad / Equal Opportunity Cell.',
                'Lodge a grievance on the UGC e-Samadhan portal (samadhan.ugc.ac.in).',
                'Escalate unresolved complaints to the District Magistrate or State Education Department.'
            ]),
            json.dumps([
                {'name': 'UGC Anti-Ragging Helpline', 'contact': '1800-180-5522'},
                {'name': 'National Transgender Portal Helpdesk', 'contact': '1800-200-1122'}
            ]),
            'Section 3(a) & Section 8, Transgender Persons Act, 2019; UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions.',
            'Educational guidance only.'
        )
    ]
    cursor.executemany(
        '''INSERT INTO legal_resources (id, title, category, problem_summary, rights_overview, practical_steps, legal_aid_contacts, official_acts, disclaimer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        legal_data
    )

    # 7. Support Locations (Leaflet Map Pins)
    locations_data = [
        (
            'loc-1',
            'Naz Foundation India Trust',
            'community',
            'A-86, East of Kailash',
            'New Delhi',
            'Delhi',
            '110065',
            28.5583,
            77.2410,
            '+91-11-40793333',
            'info@nazindia.org',
            'https://nazindia.org',
            json.dumps(['Community Support', 'Counseling', 'Health Screening', 'Advocacy']),
            'Mon - Sat: 10:00 AM - 6:00 PM',
            1
        ),
        (
            'loc-2',
            'Mitr Trust & Garima Greh Delhi',
            'emergency',
            'Plot 45, Sector 7, Dwarka',
            'New Delhi',
            'Delhi',
            '110075',
            28.5823,
            77.0700,
            '+91-11-28080123',
            'mitrtrustdelhi@gmail.com',
            'https://transgender.dosje.gov.in/GarimaGreh',
            json.dumps(['Emergency Shelter', 'Nutritional Meals', 'Vocational Tailoring', 'Counseling']),
            '24 Hours Emergency Intake',
            1
        ),
        (
            'loc-3',
            'The Humsafar Trust',
            'healthcare',
            '3rd Floor, Manthan Plaza, Vakola Market, Santacruz East',
            'Mumbai',
            'Maharashtra',
            '400055',
            19.0825,
            72.8550,
            '+91-22-26673800',
            'info@humsafar.org',
            'https://humsafar.org',
            json.dumps(['Transgender Clinic', 'Hormone Counseling', 'Mental Health Counseling', 'Legal Consultation']),
            'Mon - Sat: 10:00 AM - 6:30 PM',
            1
        ),
        (
            'loc-4',
            'Garima Greh Mumbai (Kinnar Maa Trust)',
            'support_center',
            'Opposite Railway Colony, Kurla West',
            'Mumbai',
            'Maharashtra',
            '400070',
            19.0680,
            72.8790,
            '+91-22-25031122',
            'kinnarmaatrust@gmail.com',
            'https://transgender.dosje.gov.in/GarimaGreh',
            json.dumps(['Safe Housing', 'Stitching Training', 'Crisis Intervention']),
            'Open 24/7 for Shelter',
            1
        ),
        (
            'loc-5',
            'Ondede Community Resource Center',
            'community',
            'Indiranagar 1st Stage',
            'Bengaluru',
            'Karnataka',
            '560038',
            12.9784,
            77.6408,
            '+91-80-25251144',
            'contact@ondede.org',
            'https://ondede.org',
            json.dumps(['Trans Advocacy', 'Youth Empowerment', 'Community Events', 'Emergency Support']),
            'Mon - Fri: 10:00 AM - 5:30 PM',
            1
        ),
        (
            'loc-6',
            'Sangama Legal Aid & Rights Center',
            'legal_aid',
            'A-404, 3rd Cross, Wilson Garden',
            'Bengaluru',
            'Karnataka',
            '560027',
            12.9520,
            77.5950,
            '+91-80-22241088',
            'contact@sangama.org',
            'https://sangama.org',
            json.dumps(['Free Legal Aid', 'Name Change Assistance', 'Police Complaint Escalation', 'DLSA Linkage']),
            'Mon - Sat: 9:30 AM - 6:00 PM',
            1
        ),
        (
            'loc-7',
            'Samara Skill & Livelihood Center',
            'skill_center',
            'Jayanagar 4th Block',
            'Bengaluru',
            'Karnataka',
            '560011',
            12.9299,
            77.5824,
            '+91-80-26567890',
            'info@samarasociety.org',
            'https://samarasociety.org',
            json.dumps(['Computer Training', 'Tailoring Workshops', 'Job Placement Drives']),
            'Mon - Sat: 10:00 AM - 5:00 PM',
            1
        ),
        (
            'loc-8',
            'Pratyay Gender Trust',
            'community',
            'Jadavpur Central Road',
            'Kolkata',
            'West Bengal',
            '700032',
            22.4980,
            88.3710,
            '+91-33-24145678',
            'pratyaykolkata@gmail.com',
            'https://pratyaygender.org',
            json.dumps(['Queer & Trans Community Center', 'Crisis Helpline', 'Artisan Livelihood Hub']),
            'Tue - Sun: 11:00 AM - 7:00 PM',
            1
        ),
        (
            'loc-9',
            'Telangana Transgender Resource Center',
            'support_center',
            'Near Charminar, Old City',
            'Hyderabad',
            'Telangana',
            '500002',
            17.3616,
            78.4747,
            '+91-40-24523311',
            'transresource.hyd@gov.in',
            'https://transgender.telangana.gov.in',
            json.dumps(['Government Scheme Enrollment', 'Identity Card Desk', 'Healthcare Referral']),
            'Mon - Sat: 10:00 AM - 5:00 PM',
            1
        ),
        (
            'loc-10',
            'Sahodaran Community Clinic & Support Hub',
            'healthcare',
            'Kodambakkam High Road, Nungambakkam',
            'Chennai',
            'Tamil Nadu',
            '600034',
            13.0604,
            80.2405,
            '+91-44-28269988',
            'care@sahodaran.org',
            'https://sahodaran.org',
            json.dumps(['General Outpatient', 'HIV/STI Screening', 'Psychosocial Counseling', 'Nutrition Support']),
            'Mon - Sat: 10:00 AM - 6:00 PM',
            1
        ),
        (
            'loc-11',
            'Bindu Queer Rights & Vocational Foundation',
            'skill_center',
            'FC Road, Shivajinagar',
            'Pune',
            'Maharashtra',
            '411005',
            18.5284,
            73.8410,
            '+91-20-25531234',
            'contact@bindu.org',
            'https://binduqueerfoundation.org',
            json.dumps(['Graphic Design Classes', 'English Speaking', 'Corporate Mentorship']),
            'Mon - Sat: 10:00 AM - 6:00 PM',
            1
        )
    ]
    cursor.executemany(
        '''INSERT INTO support_locations (id, name, category, address, city, state, pincode, lat, lng, phone, email, website, services_offered, operating_hours, is_verified)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        locations_data
    )

    # 8. Mentors
    mentors_data = [
        (
            'mentor-1',
            'user-mentor-1',
            'Kavya Sen',
            'Senior Software Engineer',
            'ThoughtWorks India',
            'Technology / IT',
            7,
            json.dumps(['Full-Stack Development', 'React', 'Career Transitions', 'Workplace DEI']),
            'Trans woman software architect with 7+ years in tech. Passionate about helping trans individuals transition into tech and remote engineering roles.',
            '3 hours/week (Evenings & Weekends)',
            1,
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        ),
        (
            'mentor-2',
            None,
            'Rohan Deshmukh',
            'Head of Apparel Design',
            'FabIndia Ethical Crafts',
            'Fashion & Tailoring',
            11,
            json.dumps(['Tailoring', 'Garment Export', 'Handloom Business', 'Boutique Setup']),
            'Master pattern maker and studio director with extensive experience guiding artisans to start independent tailoring units or enter fashion houses.',
            '2 hours/week (Saturdays)',
            1,
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        ),
        (
            'mentor-3',
            None,
            'Ananya Roy, Advocate',
            'Senior Legal Counsel',
            'Alternative Law Forum',
            'Legal Advocacy',
            9,
            json.dumps(['Constitutional Law', 'Workplace Rights', 'Name Change Procedure', 'DLSA Linkage']),
            'Transgender advocate practicing before High Courts. Available to mentor aspiring trans law students and guide community members on legal navigation.',
            '4 hours/week',
            1,
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        ),
        (
            'mentor-4',
            None,
            'Vikramaditya Chauhan',
            'Guest Experience Manager',
            'Lemon Tree Hotels',
            'Hospitality & Tourism',
            8,
            json.dumps(['Hospitality', 'Front Office Management', 'Customer Relations', 'Interview Prep']),
            'Hospitality leader dedicated to empowering diverse candidates to thrive in 4-star and 5-star hotel environments.',
            '2 hours/week',
            1,
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
        ),
        (
            'mentor-5',
            None,
            'Simran Kaur',
            'Salon Chain Founder & Aesthetician',
            'Glow Inclusive Beauty Studios',
            'Beauty & Wellness',
            12,
            json.dumps(['Beauty services', 'Salon Management', 'Client Retention', 'Entrepreneurship']),
            'Self-made transgender entrepreneur running three successful salons in Pune and Mumbai. Guides candidates on professional beauty courses and setting up home-based parlors.',
            '2 hours/week (Mondays)',
            1,
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        ),
        (
            'mentor-6',
            None,
            'Tariq Merchant',
            'Talent & DEI Lead',
            'Accenture India',
            'Corporate DEI & HR',
            10,
            json.dumps(['Resume Review', 'Corporate Interview Coaching', 'Workplace Onboarding', 'BPO Careers']),
            'Passionate about connecting transgender job seekers with affirmative action corporate opportunities.',
            '3 hours/week',
            1,
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
        )
    ]
    cursor.executemany(
        '''INSERT INTO mentors (id, user_id, name, title, organization, industry, years_experience, skills, bio, availability, is_accepting_mentees, avatar_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        mentors_data
    )

    # 9. Mentor Requests (Sample for demonstration)
    mentor_requests_data = [
        (
            'req-1',
            'mentor-1',
            'user-seeker-1',
            'Aarav Sharma',
            'aarav@saksham.org',
            'Looking to improve my front-end web development skills and apply for my first remote tech role.',
            'Hi Kavya, I recently completed basic HTML/CSS and would love guidance on preparing my portfolio projects.',
            'Accepted'
        ),
        (
            'req-2',
            'mentor-2',
            'user-seeker-1',
            'Aarav Sharma',
            'aarav@saksham.org',
            'Guidance on setting up a home tailoring boutique with MUDRA loan.',
            'I know commercial tailoring and want to know how to structure wholesale bulk orders.',
            'Pending'
        )
    ]
    cursor.executemany(
        '''INSERT INTO mentor_requests (id, mentor_id, mentee_id, mentee_name, mentee_email, goals, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
        mentor_requests_data
    )

    # 10. Community Posts
    posts_data = [
        (
            'post-1',
            'user-seeker-1',
            'Aarav Sharma',
            0,
            'success_stories',
            'Received my official Transgender ID card from the National Portal in 22 days!',
            'Wanted to share some positive encouragement with everyone here! I filed Form-2 on transgender.dosje.gov.in last month with a simple notarized affidavit. The DM office in South Delhi approved it without asking for any hospital visits or questions. The digital QR card is now in my hands, and I have already linked it to my Ayushman Bharat TG Plus card. Stay confident and feel free to ask questions below if you need step-by-step guidance!',
            18,
            4,
            0
        ),
        (
            'post-2',
            'user-seeker-anon',
            'SakshamMember_204',
            1,
            'career',
            'How to handle previous employment verification when legal name changed?',
            'Posting anonymously for privacy. I recently updated my legal name and gender on my Aadhaar and PAN cards under the 2019 Act. However, my past 3 years of work experience certificates and college degrees are under my deadname. When applying to new inclusive companies on Saksham, how do you handle HR background verification smoothly without feeling exposed?',
            12,
            6,
            0
        ),
        (
            'post-3',
            'user-mentor-1',
            'Kavya Sen',
            0,
            'career',
            'Free Resume & Portfolio Review Session for Trans Tech Aspirants this Saturday',
            'Hey friends! As part of our community mentorship initiative, I am hosting a 2-hour virtual clinic this Saturday to review resumes, GitHub profiles, and answer interview questions for front-end and QA roles. Drop your request on the Mentorship page or leave a comment!',
            24,
            8,
            0
        ),
        (
            'post-4',
            'user-seeker-anon',
            'SakshamMember_881',
            1,
            'legal',
            'Can a landlord evict you without 30-day notice in Maharashtra?',
            'I am currently renting an apartment in Pune. Yesterday the building society chairman spoke to my flat owner asking them to terminate my lease because they found out about my trans identity. Please know your rights: Under Section 3(c) of the 2019 Act, housing discrimination is strictly illegal. The DLSA advocate helped me draft a formal response and the society apologized.',
            31,
            5,
            0
        )
    ]
    cursor.executemany(
        '''INSERT INTO community_posts (id, user_id, author_name, is_anonymous, channel, title, content, likes_count, comments_count, is_reported)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        posts_data
    )

    # 11. Community Comments
    comments_data = [
        (
            'comm-1',
            'post-1',
            'user-seeker-anon',
            'SakshamMember_492',
            1,
            'Congratulations Aarav! This gives me so much hope. Did you have to submit any physical paperwork at the tehsil office?'
        ),
        (
            'comm-2',
            'post-1',
            'user-seeker-1',
            'Aarav Sharma',
            0,
            'No physical visit at all! Everything was uploaded online in PDF format on the portal.'
        ),
        (
            'comm-3',
            'post-2',
            'user-mentor-1',
            'Kavya Sen',
            0,
            'Great question. You can attach your official Transgender Certificate alongside your old certificates. Most DEI-friendly companies have an internal confidential NDA process where only 1 HR officer sees the name transition proof.'
        )
    ]
    cursor.executemany(
        '''INSERT INTO community_comments (id, post_id, user_id, author_name, is_anonymous, content)
           VALUES (?, ?, ?, ?, ?, ?)''',
        comments_data
    )

    # 12. Applications
    applications_data = [
        (
            'app-1',
            'job-1',
            'user-seeker-1',
            'Aarav Sharma',
            'aarav@saksham.org',
            'I have 1 year experience in retail communication and fluent English/Hindi skills.',
            'https://example.com/resumes/aarav_sharma.pdf',
            'Under Review'
        ),
        (
            'app-2',
            'job-2',
            'user-seeker-1',
            'Aarav Sharma',
            'aarav@saksham.org',
            'Completed vocational garment cutting and commercial sewing diploma.',
            'https://example.com/resumes/aarav_sharma.pdf',
            'Applied'
        )
    ]
    cursor.executemany(
        '''INSERT INTO applications (id, job_id, user_id, applicant_name, email, notes, resume_url, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
        applications_data
    )

    # 13. Notifications
    notifications_data = [
        (
            'notif-1',
            'user-seeker-1',
            'Application Update',
            'Your application for Customer Support Executive at Aegis Inclusive Solutions is now Under Review.',
            'job',
            '/jobs'
        ),
        (
            'notif-2',
            'user-seeker-1',
            'Mentorship Request Accepted',
            'Kavya Sen has accepted your mentorship request on Full-Stack Development.',
            'mentor',
            '/mentorship'
        ),
        (
            'notif-3',
            'user-seeker-1',
            'Recommended Opportunity',
            'New opening matching your Tailoring skills: Apparel Pattern & Tailoring Associate.',
            'job',
            '/jobs'
        )
    ]
    cursor.executemany(
        '''INSERT INTO notifications (id, user_id, title, message, type, link)
           VALUES (?, ?, ?, ?, ?, ?)''',
        notifications_data
    )

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic, verified Indian schemes and demo data.")

if __name__ == '__main__':
    from database import init_db
    init_db()
    seed_database()
