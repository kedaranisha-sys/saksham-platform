export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const NATIONAL_HELPLINES = [
  {
    name: 'National Transgender Helpline (MoSJE)',
    number: '1800-200-1122',
    description: 'Toll-free psychological support, scheme guidance, and crisis intervention for transgender persons across India.',
    timing: '24 Hours / 7 Days a Week',
    badge: 'Official Ministry Toll-Free'
  },
  {
    name: 'Emergency Police Response Support',
    number: '112',
    description: 'Unified pan-India emergency number for immediate physical safety, distress, and police assistance.',
    timing: '24x7 Immediate Dispatch',
    badge: 'Pan-India Emergency'
  },
  {
    name: 'Tele-MANAS Mental Health Helpline',
    number: '14416',
    description: 'Government of India comprehensive mental health counseling service in multiple regional languages.',
    timing: '24x7 Confidential',
    badge: 'Mental Health'
  },
  {
    name: 'National Legal Services Authority (NALSA)',
    number: '15100',
    description: 'Free legal aid and advice for marginalized individuals, including assistance in filing complaints.',
    timing: '9:30 AM - 6:00 PM',
    badge: 'Free Legal Aid'
  },
  {
    name: 'Women & LGBTQ+ Crisis Helpline',
    number: '1091',
    description: 'Emergency response for violence, harassment, and immediate distress.',
    timing: '24x7 Toll-Free',
    badge: 'Crisis Support'
  }
];

export const SKILL_CATEGORIES = [
  'All',
  'Tailoring',
  'Computer skills',
  'Programming',
  'Customer Support',
  'Beauty services',
  'Hospitality',
  'Communication',
  'Graphic design',
  'Marketing',
  'Cooking',
  'Craft',
  'Data Entry'
];

export const SCHEME_CATEGORIES = [
  'All',
  'Education',
  'Employment',
  'Financial assistance',
  'Housing',
  'Healthcare',
  'Skill development',
  'Entrepreneurship',
  'Identity/documentation'
];

export const LEGAL_CATEGORIES = [
  'All',
  'Employment discrimination',
  'Education',
  'Housing',
  'Healthcare',
  'Identity/documentation',
  'Violence/harassment',
  'General rights'
];

export const MAP_CATEGORIES = [
  { id: 'all', label: 'All Services', color: '#0d9488' },
  { id: 'community', label: 'Community Orgs', color: '#16a34a' }, // Green
  { id: 'skill_center', label: 'Skill Centers', color: '#2563eb' }, // Blue
  { id: 'legal_aid', label: 'Legal Aid Clinics', color: '#9333ea' }, // Purple
  { id: 'healthcare', label: 'Healthcare & Clinics', color: '#ea580c' }, // Orange
  { id: 'support_center', label: 'Support Centers', color: '#ca8a04' }, // Yellow
  { id: 'emergency', label: 'Emergency Shelters (Garima Greh)', color: '#dc2626' } // Red
];

export const DEMO_PRESENTATION_SCENARIOS = [
  {
    id: 'demo-1',
    title: 'Demo 1: AI Assistant → Job Recommendation',
    query: 'I need a job in customer support and communication.',
    targetTab: 'ai',
    description: 'Demonstrates Saksham AI natural-language understanding, intent detection, and contextual matching with inclusive employers.'
  },
  {
    id: 'demo-2',
    title: 'Demo 2: Government Support Finder',
    targetTab: 'schemes',
    description: 'Shows authentic verified Indian government schemes (SMILE, National TG ID Card, Garima Greh, Ayushman Bharat TG Plus) with verified dates.'
  },
  {
    id: 'demo-3',
    title: 'Demo 3: Interactive Support Map',
    targetTab: 'map',
    description: 'Displays verified community shelters, clinics, and legal aid across India with Leaflet, category pins, and Haversine distance calculations.'
  },
  {
    id: 'demo-4',
    title: 'Demo 4: AI Skill & Job Matcher',
    targetTab: 'dashboard',
    description: 'Shows personalized recommendation cards explaining: "Recommended because you have matching skills in: Tailoring..."'
  },
  {
    id: 'demo-5',
    title: 'Demo 5: Mentorship Matching',
    targetTab: 'mentorship',
    description: 'Demonstrates mentor discovery by industry and submitting direct mentorship requests with real-time status tracking.'
  },
  {
    id: 'demo-6',
    title: 'Demo 6: Entrepreneurship Business Hub',
    targetTab: 'business',
    description: 'Demonstrates the AI Business Plan Generator for micro-enterprises with equipment lists, subsidized loans (MUDRA/NBCFDC), and launch roadmap.'
  }
];
