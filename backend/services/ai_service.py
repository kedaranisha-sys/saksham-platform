import json
import re
import os
import requests
from config import Config
from database import get_db_connection

def classify_intent(query):
    query_lower = query.lower()

    if any(w in query_lower for w in ['emergency', 'danger', 'suicide', 'threat', 'help me now', 'police', 'violence', 'beaten', 'assault']):
        return 'safety'
    if any(w in query_lower for w in ['job', 'work', 'hire', 'vacancy', 'career', 'employment', 'salary', 'resume', 'earn money', 'interview']):
        return 'jobs'
    if any(w in query_lower for w in ['course', 'learn', 'skill', 'training', 'bootcamp', 'vocational', 'computer', 'digital literacy', 'tailoring training']):
        return 'skills'
    if any(w in query_lower for w in ['scheme', 'government', 'smile', 'id card', 'tg card', 'certificate', 'subsidy', 'allowance', 'scholarship', 'pmkvy', 'benefit', 'garima greh']):
        return 'schemes'
    if any(w in query_lower for w in ['legal', 'lawyer', 'rights', 'discrimination', 'evict', 'landlord', 'fired', 'nalsa', 'police complaint', 'court', 'harassment']):
        return 'legal'
    if any(w in query_lower for w in ['map', 'near me', 'nearby', 'location', 'clinic', 'hospital', 'center', 'ngo', 'organization', 'shelter']):
        return 'map'
    if any(w in query_lower for w in ['business', 'entrepreneur', 'startup', 'shop', 'boutique', 'parlor', 'salon', 'earn from home', 'sell', 'mudra', 'loan']):
        return 'entrepreneurship'
    if any(w in query_lower for w in ['mentor', 'guidance', 'advice', 'career coach', 'guide', 'kavya']):
        return 'mentorship'
    if any(w in query_lower for w in ['community', 'forum', 'discuss', 'experience', 'peer', 'talk to others']):
        return 'community'

    return 'general'

def search_platform_resources(intent, query):
    conn = get_db_connection()
    cursor = conn.cursor()
    results = {'type': intent, 'items': []}

    try:
        query_words = [w for w in re.findall(r'\w+', query.lower()) if len(w) > 3]

        if intent == 'jobs':
            cursor.execute("SELECT id, title, employer_name, location, salary_range, skills_required, job_type FROM jobs WHERE status = 'active' LIMIT 4")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['title'],
                    'subtitle': f"{r['employer_name']} • {r['location']}",
                    'highlight': r['salary_range'],
                    'path': f"/jobs?id={r['id']}",
                    'badge': 'Inclusive Workplace'
                }
                for r in rows
            ]
        elif intent == 'skills':
            cursor.execute("SELECT id, title, provider, duration, cost, mode, skill_category FROM courses LIMIT 4")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['title'],
                    'subtitle': f"{r['provider']} • {r['duration']}",
                    'highlight': f"{r['cost']} ({r['mode']})",
                    'path': f"/skills?id={r['id']}",
                    'badge': 'Verified Program'
                }
                for r in rows
            ]
        elif intent == 'schemes':
            cursor.execute("SELECT id, name, provider, category, benefits, official_url, last_verified_date FROM government_schemes LIMIT 4")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['name'],
                    'subtitle': r['provider'],
                    'highlight': f"Verified: {r['last_verified_date']}",
                    'path': f"/schemes?id={r['id']}",
                    'badge': 'Official Government Scheme'
                }
                for r in rows
            ]
        elif intent == 'legal':
            cursor.execute("SELECT id, title, category, problem_summary, official_acts FROM legal_resources LIMIT 3")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['title'],
                    'subtitle': r['official_acts'],
                    'highlight': r['category'],
                    'path': f"/legal?id={r['id']}",
                    'badge': 'Legal Rights Guide'
                }
                for r in rows
            ]
        elif intent == 'map':
            cursor.execute("SELECT id, name, category, city, address, phone FROM support_locations LIMIT 4")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['name'],
                    'subtitle': f"{r['address']}, {r['city']}",
                    'highlight': r['phone'] or 'Contact via center',
                    'path': f"/map?id={r['id']}",
                    'badge': r['category'].replace('_', ' ').capitalize()
                }
                for r in rows
            ]
        elif intent == 'mentorship':
            cursor.execute("SELECT id, name, title, organization, industry, availability FROM mentors LIMIT 3")
            rows = cursor.fetchall()
            results['items'] = [
                {
                    'id': r['id'],
                    'title': r['name'],
                    'subtitle': f"{r['title']} at {r['organization']}",
                    'highlight': r['availability'],
                    'path': f"/mentorship?id={r['id']}",
                    'badge': r['industry']
                }
                for r in rows
            ]
    except Exception as e:
        print(f"Error searching platform resources: {e}")
    finally:
        conn.close()

    return results

def call_gemini_api(prompt, system_instruction):
    if not Config.GEMINI_API_KEY:
        return None

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Config.GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 800
            }
        }
        headers = {"Content-Type": "application/json"}
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Gemini API call failed, using intelligent fallback: {e}")

    return None

def process_chat_message(user_message, conversation_history=None, user_context=None):
    """
    Core AI assistant handler with intent classification, platform knowledge RAG,
    ethical guardrails, and actionable deep-links.
    """
    intent = classify_intent(user_message)
    platform_data = search_platform_resources(intent, user_message)

    # Standard Disclaimers based on intent
    disclaimer = None
    if intent == 'legal':
        disclaimer = "⚠️ Saksham AI is an educational guidance system and cannot represent you as a licensed advocate. For active legal disputes, please contact the National Legal Services Authority (15100) or an empaneled legal clinic."
    elif intent == 'safety':
        disclaimer = "🚨 EMERGENCY NOTICE: Saksham AI is NOT an emergency dispatch service. If you are in immediate physical danger, call Police at 112 or the National Transgender Helpline at 1800-200-1122 right now."
    elif intent in ['jobs', 'entrepreneurship']:
        disclaimer = "💡 Verified Information: All listed jobs on Saksham are from verified inclusive employers. Financial or salary projections are estimated indicators."

    # Suggested Next Actions
    suggested_actions = []
    if intent == 'jobs':
        suggested_actions = [
            {'title': 'Browse Inclusive Jobs', 'path': '/jobs'},
            {'title': 'Take Free Skill Courses', 'path': '/skills'},
            {'title': 'Connect with a Career Mentor', 'path': '/mentorship'}
        ]
    elif intent == 'skills':
        suggested_actions = [
            {'title': 'Explore All Free Courses', 'path': '/skills'},
            {'title': 'Check PMKVY Training Scheme', 'path': '/schemes'},
            {'title': 'Find Nearby Skill Center', 'path': '/map'}
        ]
    elif intent == 'schemes':
        suggested_actions = [
            {'title': 'Government Support Finder', 'path': '/schemes'},
            {'title': 'National TG Portal Guide', 'path': '/schemes?id=scheme-tg-portal'},
            {'title': 'Ayushman Bharat TG Plus Info', 'path': '/schemes?id=scheme-ayushman-tg'}
        ]
    elif intent == 'legal':
        suggested_actions = [
            {'title': 'Legal Rights Center', 'path': '/legal'},
            {'title': 'Find Legal Aid on Map', 'path': '/map?category=legal_aid'},
            {'title': 'Emergency Helplines', 'path': '/safety'}
        ]
    elif intent == 'map':
        suggested_actions = [
            {'title': 'Open Interactive Support Map', 'path': '/map'},
            {'title': 'Find Garima Greh Shelter', 'path': '/map?category=emergency'},
            {'title': 'Safety & Crisis Center', 'path': '/safety'}
        ]
    elif intent == 'entrepreneurship':
        suggested_actions = [
            {'title': 'Generate AI Business Plan', 'path': '/business'},
            {'title': 'NBCFDC 4-6% Micro-Loans', 'path': '/schemes?id=scheme-nbcfdc-loan'},
            {'title': 'Connect with Business Mentors', 'path': '/mentorship'}
        ]
    elif intent == 'safety':
        suggested_actions = [
            {'title': 'View All National Helplines', 'path': '/safety'},
            {'title': 'Find Safe Shelter on Map', 'path': '/map?category=emergency'},
            {'title': 'Setup Trusted Contact', 'path': '/safety#trusted-contact'}
        ]
    else:
        suggested_actions = [
            {'title': 'Search Jobs', 'path': '/jobs'},
            {'title': 'Government Schemes', 'path': '/schemes'},
            {'title': 'Support Map', 'path': '/map'},
            {'title': 'Legal Rights', 'path': '/legal'}
        ]

    # Check for Gemini API generation or fallback
    system_instruction = (
        "You are Saksham AI, an empowering, respectful, and highly competent virtual advisor "
        "for the transgender community in India. Your purpose is to connect users with employment, "
        "skill development, government schemes (like SMILE, National TG ID portal, Garima Greh, "
        "Ayushman Bharat TG Plus), legal rights (2019 Act & NALSA judgment), and support organizations. "
        "Rules: 1) Never pretend to be a lawyer, doctor, or emergency responder. 2) Keep answers concise, "
        "actionable, dignified, and structured with bullet points. 3) Refer users to the Saksham platform "
        "features (Jobs, Skills, Schemes, Legal Center, Support Map, Mentors)."
    )

    context_str = f"User Intent: {intent}\nAvailable Platform Items: {json.dumps(platform_data.get('items', []))}\nUser Query: {user_message}"
    gemini_reply = call_gemini_api(context_str, system_instruction)

    if gemini_reply:
        ai_reply = gemini_reply
    else:
        # High quality built-in knowledge response
        if intent == 'safety':
            ai_reply = (
                "Your safety and well-being are paramount. If you are in immediate danger or facing violence:\n\n"
                "• **Emergency Police Helpline**: Dial **112** (available 24x7 pan-India)\n"
                "• **National Transgender Helpline**: Dial **1800-200-1122** (toll-free counseling & crisis aid)\n"
                "• **Tele-MANAS Mental Health Support**: Dial **14416**\n"
                "• **Garima Greh Safe Shelters**: You can access safe residential shelters with food and medical care.\n\n"
                "Please click the Emergency Help actions below to locate safe shelters or activate your trusted contact alert."
            )
        elif intent == 'jobs':
            ai_reply = (
                "Here are immediate opportunities and pathways for inclusive employment on Saksham:\n\n"
                "• **Verified Inclusive Employers**: All organizations listing roles on Saksham have signed equal opportunity and anti-harassment pledges.\n"
                "• **Roles for Every Skill Level**: We feature openings across Customer Experience, Web Development, Tailoring & Pattern Making, Hospitality (e.g. Lemon Tree Hotels), Beauty & Wellness, and Office Administration.\n"
                "• **Workplace Rights**: Under the Transgender Persons Act 2019, discrimination in recruitment and promotions is strictly prohibited.\n\n"
                "Check the matching listings below or open the Opportunities tab to filter by your city and remote options."
            )
        elif intent == 'skills':
            ai_reply = (
                "Building economic independence starts with certified skills. On Saksham, you can access:\n\n"
                "• **100% Free Vocational Training**: Supported under the central government's SMILE & PMKVY schemes, including daily conveyance stipends.\n"
                "• **Digital & Tech Tracks**: Foundational Digital Literacy (NIELIT), Web Development (FreeCodeCamp/Saksham), and BPO Communication.\n"
                "• **Vocational & Creative Crafts**: Commercial Garment Construction, Beauty & Salon Therapy, and Handicrafts.\n\n"
                "Explore the verified courses below to enroll and earn recognized certifications."
            )
        elif intent == 'schemes':
            ai_reply = (
                "The Government of India provides key welfare initiatives specifically for transgender persons. Key verified schemes include:\n\n"
                "1. **National Portal ID Card (transgender.dosje.gov.in)**: Get your official Transgender Certificate online with zero physical visits.\n"
                "2. **SMILE Scheme**: Comprehensive livelihood package covering skill training stipends and enterprise support.\n"
                "3. **Ayushman Bharat TG Plus Package**: ₹5 Lakh/year cashless health coverage across empaneled hospitals including gender-affirmation care.\n"
                "4. **Garima Greh**: Safe residential shelter homes with food, lodging, and medical assistance.\n"
                "5. **NBCFDC Concessional Loans**: Low-interest micro-finance (4-6% p.a.) for launching small businesses.\n\n"
                "Review the required documents and application links in the Government Support Finder below."
            )
        elif intent == 'legal':
            ai_reply = (
                "You are protected under Indian Constitutional Law (NALSA 2014) and the Transgender Persons (Protection of Rights) Act, 2019:\n\n"
                "• **Workplace Rights**: Section 9 prohibits hiring, promotion, or wage discrimination based on gender identity.\n"
                "• **Right to Self-Identity**: No physical or medical surgery inspection can be mandated to issue a Transgender Certificate (Rule 3).\n"
                "• **Housing Protection**: Landlords cannot unlawfully deny or evict tenants solely due to gender identity.\n"
                "• **Free Legal Aid**: You are entitled to free legal representation through the District Legal Services Authority (DLSA) by calling **15100**.\n\n"
                "Browse the step-by-step practical action guides below."
            )
        elif intent == 'entrepreneurship':
            ai_reply = (
                "Starting your own independent enterprise is a powerful route to self-reliance. Here is how Saksham supports you:\n\n"
                "• **Skill-to-Business Pathways**: If you know tailoring, beauty, cooking, graphic design, or handicrafts, you can launch home-based or local ventures.\n"
                "• **Subsidized Capital**: Under the NBCFDC Term Loan and SMILE scheme, you can access loans up to ₹5,00,000 at only 4-6% interest.\n"
                "• **AI Business Plan Generator**: Use the Saksham Business Hub to get a customized startup plan, equipment checklist, and marketing roadmap.\n\n"
                "Click below to generate a tailored business plan or view micro-enterprise funding options."
            )
        elif intent == 'map':
            ai_reply = (
                "The Saksham Support Map connects you with verified local and regional resources:\n\n"
                "🟢 **Community Organizations**: Peer support, counseling, and social gatherings\n"
                "🔵 **Skill Centers**: Accredited training labs for tailoring, computers, and crafts\n"
                "🟣 **Legal Aid Clinics**: Empaneled DLSA and HRLN legal advocates\n"
                "🟠 **Healthcare Resources**: Sensitized clinics and hormone counseling centers\n"
                "🔴 **Emergency & Garima Greh**: 24/7 safe residential shelters\n\n"
                "Open the interactive map below to view locations with one-click Google Maps directions and direct phone contacts."
            )
        elif intent == 'mentorship':
            ai_reply = (
                "Connecting with experienced mentors who understand your lived journey accelerates career growth. Our mentors include:\n\n"
                "• Senior Software Engineers & Tech Leaders\n"
                "• Master Tailors & Fashion Entrepreneurs\n"
                "• Practicing High Court Advocates\n"
                "• Hospitality and Salon Executives\n\n"
                "Browse our vetted mentors below and submit a direct mentorship request."
            )
        else:
            ai_reply = (
                "Welcome to Saksham! I am your AI navigator here to assist you in finding:\n\n"
                "1. **Inclusive Jobs**: Browse openings from equal-opportunity employers.\n"
                "2. **Skill Training**: 100% free online and offline courses with certification.\n"
                "3. **Government Schemes**: SMILE, National TG ID Portal, Ayushman Bharat TG Plus, and Garima Greh.\n"
                "4. **Legal Rights Guidance**: Practical action steps for discrimination, housing, and documentation.\n"
                "5. **Support Map**: Verified NGOs, clinics, and shelter homes near you.\n\n"
                "What would you like to explore today?"
            )

    return {
        'reply': ai_reply,
        'intent': intent,
        'suggested_actions': suggested_actions,
        'resources': platform_data.get('items', []),
        'disclaimer': disclaimer
    }

def generate_business_plan(skill_or_idea, investment_budget=None, location=None):
    """
    AI-powered entrepreneurship startup plan generator for the Saksham Business Hub.
    Generates concept, target market, equipment, demo financial estimates, government subsidies, and 30-day roadmap.
    """
    cleaned = skill_or_idea.strip()

    # Call Gemini API if available
    system_instruction = (
        "You are an expert micro-enterprise startup consultant working for Saksham, "
        "an empowerment platform for transgender entrepreneurs in India. "
        "Generate a structured, practical, inspiring business plan tailored to the user's skill. "
        "Return a valid JSON object with keys: title, concept, target_customers, equipment_needed, "
        "financial_estimates (startup_cost, monthly_revenue_potential, monthly_operating_cost, break_even_months), "
        "government_schemes, marketing_strategy, and roadmap_steps. "
        "Label all financials as estimated demo projections."
    )
    prompt = f"Create a comprehensive business startup plan for a transgender entrepreneur specializing in: {cleaned}. Location: {location or 'India'}. Budget: {investment_budget or 'Micro-budget under 1 Lakh'}."

    gemini_raw = call_gemini_api(prompt, system_instruction)
    if gemini_raw:
        try:
            # Clean possible markdown formatting
            json_match = re.search(r'\{.*\}', gemini_raw, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except Exception as e:
            print(f"Failed parsing Gemini JSON business plan: {e}")

    # Robust domain generator fallback
    skill_lower = cleaned.lower()

    if any(k in skill_lower for k in ['tailor', 'stitch', 'embroidery', 'garment', 'fashion', 'boutique', 'cloth']):
        return {
            'title': f"Custom Apparel & Tailoring Boutique ({cleaned.capitalize()})",
            'concept': "Establish an independent bespoke tailoring and alterations studio catering to neighborhood residents, custom festive wear, and local boutique subcontracting.",
            'target_customers': [
                "Local neighborhood families seeking custom salwar suits, blouses, and dress alterations",
                "Working professionals requiring urgent fitting and zipper replacements",
                "Regional boutique designers looking for reliable contract pattern-making and finishing"
            ],
            'equipment_needed': [
                "Industrial single-needle sewing machine (e.g. Juki or Jack) - Approx ₹18,000",
                "Overlock interlock machine (3 or 4-thread) - Approx ₹14,000",
                "Cutting table, tailoring shears, measurement scales, and dress mannequin",
                "Steam iron and pressing station",
                "Initial inventory: thread spools, zippers, hooks, fusing, and lining fabrics"
            ],
            'financial_estimates': {
                'startup_cost': "₹45,000 - ₹65,000 (Approximate Demo Estimate)",
                'monthly_revenue_potential': "₹25,000 - ₹45,000 / month (Approximate Demo Estimate)",
                'monthly_operating_cost': "₹6,000 - ₹10,000 (power, threads, maintenance)",
                'break_even_months': "3 - 5 Months"
            },
            'government_schemes': [
                "NBCFDC Concessional Loan: Subsidized micro-credit at 4-6% p.a. for machinery",
                "Pradhan Mantri MUDRA Yojana (Shishu Loan): Collateral-free loan up to ₹50,000",
                "SMILE Micro-Enterprise Subsidy via MoSJE"
            ],
            'marketing_strategy': [
                "Distribute attractive launch flyers in residential societies offering free alteration on first blouse/suit",
                "Create an Instagram and WhatsApp Business catalog showcasing precision stitch finishes",
                "Partner with local fabric stores to refer stitching clients with a small referral incentive"
            ],
            'roadmap_steps': [
                "Week 1: Finalize workspace setup (home corner or small rented room) and procure machinery quotes",
                "Week 2: Apply for MUDRA or NBCFDC loan through your nearest nationalized bank or SCA",
                "Week 3: Print visiting cards and prepare 5 display samples demonstrating your best stitching",
                "Week 4: Official launch with WhatsApp announcement and inaugural neighborhood pricing"
            ]
        }
    elif any(k in skill_lower for k in ['beauty', 'parlor', 'salon', 'makeup', 'hair', 'skin', 'cosmetic']):
        return {
            'title': f"Inclusive Beauty & Wellness Studio ({cleaned.capitalize()})",
            'concept': "Launch a welcoming, hygienic home salon and doorstep beauty service offering skincare treatments, bridal packages, hair styling, and manicures.",
            'target_customers': [
                "Home-makers and working women in residential colonies seeking doorstep convenience",
                "College students looking for affordable, modern grooming and waxing",
                "Queer and allied community members desiring a safe, non-judgmental makeover space"
            ],
            'equipment_needed': [
                "Professional facial steamer, galvanic kit, and magnifying beauty lamp",
                "Salon reclining hydraulic chair or portable massage table",
                "Hair dryer, straightener, curling wands, and sterilizer cabinet",
                "Skincare product inventory: waxes, facial kits, bleach, shampoos, and disposables"
            ],
            'financial_estimates': {
                'startup_cost': "₹50,000 - ₹75,000 (Approximate Demo Estimate)",
                'monthly_revenue_potential': "₹30,000 - ₹55,000 / month (Approximate Demo Estimate)",
                'monthly_operating_cost': "₹8,000 - ₹12,000 (consumables and electricity)",
                'break_even_months': "4 - 6 Months"
            },
            'government_schemes': [
                "Pradhan Mantri MUDRA Yojana (Kishore Loan up to ₹5 Lakh)",
                "Stand-Up India / State Women & Transgender Welfare Subsidies",
                "NSDC Beauty & Wellness tool kit subsidy"
            ],
            'marketing_strategy': [
                "Offer a festive 'Buy 1 Facial, Get Free Threading & Clean-up' package",
                "Launch a Google Business profile with customer reviews and photo portfolio",
                "Offer on-demand doorstep appointments for brides and family wedding parties"
            ],
            'roadmap_steps': [
                "Week 1: Select beauty salon brands (VLCC, Lotus, Cheryls) and obtain wholesale trade rates",
                "Week 2: Set up a spotless, sanitized corner with relaxing aesthetic lighting",
                "Week 3: Offer free trials to 5 close friends to build your initial photo portfolio",
                "Week 4: Launch promotional pricing flyers and take online appointment bookings"
            ]
        }
    elif any(k in skill_lower for k in ['food', 'cook', 'bake', 'catering', 'bakery', 'cloud kitchen', 'snack']):
        return {
            'title': f"Artisan Catering & Cloud Kitchen ({cleaned.capitalize()})",
            'concept': "Operate a hygienic home-kitchen or meal-subscription venture delivering wholesome regional lunch boxes (tiffin service) and artisanal snacks.",
            'target_customers': [
                "Single IT professionals and migrant students craving home-cooked healthy meals",
                "Small office teams needing bulk daily lunch tiffin delivery",
                "Community gatherings, birthday parties, and festive celebrations"
            ],
            'equipment_needed': [
                "Heavy-duty commercial mixer-grinder and high-capacity gas burner",
                "Stainless steel food containers, tiffin carriers, and thermal bags",
                "Food-grade tamper-evident packaging and labeling materials",
                "FSSAI Food Safety Basic Registration (₹100/yr)"
            ],
            'financial_estimates': {
                'startup_cost': "₹30,000 - ₹50,000 (Approximate Demo Estimate)",
                'monthly_revenue_potential': "₹28,000 - ₹60,000 / month (Approximate Demo Estimate)",
                'monthly_operating_cost': "₹14,000 - ₹25,000 (groceries, packaging, fuel)",
                'break_even_months': "2 - 3 Months"
            },
            'government_schemes': [
                "PM SVANidhi Micro-Credit Scheme (Urban food and service vendors)",
                "MUDRA Shishu Loan for cooking equipment",
                "FSSAI FoSTaC Free Food Safety Certification"
            ],
            'marketing_strategy': [
                "Distribute 1-day free tasting boxes to admin managers at nearby co-working spaces",
                "Post mouth-watering reels of daily preparation emphasizing cleanliness and freshness",
                "Offer weekly and monthly subscription plans with free doorstep delivery"
            ],
            'roadmap_steps': [
                "Week 1: Standardize a rotating 5-day meal menu with consistent portion sizes",
                "Week 2: Obtain FSSAI registration online on foscos.fssai.gov.in",
                "Week 3: Sign up first 10 trial subscribers through personal networks",
                "Week 4: Expand delivery radius and register on delivery aggregator networks"
            ]
        }
    else:
        return {
            'title': f"Specialized Independent Venture in {cleaned.capitalize()}",
            'concept': f"Build an agile, service-oriented business leveraging your expertise in {cleaned}, serving both direct retail clients and institutional partners.",
            'target_customers': [
                "Direct consumer clients looking for high-quality, personalized service",
                "Local small businesses seeking outsourced specialized assistance",
                "Digital customers reached through social media channels"
            ],
            'equipment_needed': [
                f"Core tools and dedicated starter kit for {cleaned}",
                "Smartphone or laptop for digital marketing and client communication",
                "Professional workspace setup and organization materials",
                "Standard packaging and branding collateral"
            ],
            'financial_estimates': {
                'startup_cost': "₹25,000 - ₹50,000 (Approximate Demo Estimate)",
                'monthly_revenue_potential': "₹20,000 - ₹40,000 / month (Approximate Demo Estimate)",
                'monthly_operating_cost': "₹5,000 - ₹8,000",
                'break_even_months': "3 - 4 Months"
            },
            'government_schemes': [
                "NBCFDC Concessional Loan Scheme for Transgender Entrepreneurs (4-6% interest)",
                "Pradhan Mantri MUDRA Yojana (Up to ₹50,000 Shishu category)",
                "Udyam Registration (Free Government MSME certification)"
            ],
            'marketing_strategy': [
                "Create an official WhatsApp Business profile with product/service catalog",
                "Build word-of-mouth through introductory discounts for early adopters",
                "Collaborate with peer entrepreneurs on Saksham Community for cross-promotion"
            ],
            'roadmap_steps': [
                "Week 1: Define clear pricing tiers and assemble your service equipment",
                "Week 2: Register for free Udyam MSME certificate online to open a current account",
                "Week 3: Showcase your work on Saksham Community Hub and social media",
                "Week 4: Onboard first paying clients and collect testimonials"
            ]
        }
