import React from 'react';
import {
  Briefcase,
  GraduationCap,
  FileCheck,
  Scale,
  Shield,
  Users,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function LandingPage({ onSelectTab, onOpenAi }) {
  const whyCards = [
    {
      icon: Briefcase,
      title: 'Inclusive Employment',
      desc: 'Connect with verified employers offering equal opportunity, sensitized workspaces, and gender affirmation benefits.',
      tab: 'jobs',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      icon: GraduationCap,
      title: 'Education & Skills',
      desc: '100% free vocational and digital literacy courses under SMILE and PMKVY to build market-ready career skills.',
      tab: 'skills',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FileCheck,
      title: 'Government Schemes',
      desc: 'Comprehensive access to official welfare policies, the National TG ID Card portal, Ayushman Bharat, and subsidies.',
      tab: 'schemes',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Scale,
      title: 'Legal Rights & Aid',
      desc: 'Clear guidance on workplace discrimination, housing tenancy, and name change procedures under the 2019 Act and NALSA.',
      tab: 'legal',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'Safety & Emergency',
      desc: 'Direct 24x7 access to National Transgender Helplines, safe Garima Greh shelters, and confidential trusted contact alerts.',
      tab: 'safety',
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: MapPin,
      title: 'Geospatial Support Map',
      desc: 'Interactive Leaflet map locating verified community organizations, clinics, legal aid clinics, and crisis shelters near you.',
      tab: 'map',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: UserCheck,
      title: 'Mentorship Network',
      desc: 'One-on-one career guidance from experienced queer professionals, entrepreneurs, software architects, and advocates.',
      tab: 'mentorship',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Building2,
      title: 'Entrepreneurship Hub',
      desc: 'Turn your skills into sustainable micro-enterprises with our AI Business Plan Generator and MUDRA/NBCFDC micro-loans.',
      tab: 'business',
      color: 'from-cyan-500 to-brand-600'
    }
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', text: 'Sign up privately. Choose your preferred name or browse completely anonymously with zero forced disclosure.' },
    { num: '02', title: 'Tell Saksham What You Need', text: 'Select whether you seek employment, skill certifications, government schemes, or legal assistance.' },
    { num: '03', title: 'Get Personalized AI Guidance', text: 'Saksham AI calculates matching opportunities and explains exactly why each resource fits your goals.' },
    { num: '04', title: 'Connect with Verified Resources', text: 'Apply to inclusive employers, enroll in certified training, or locate nearby support centers on the map.' },
    { num: '05', title: 'Build Long-Term Independence', text: 'Track application progress, receive mentor advice, or generate a customized business startup plan.' }
  ];

  const impactStats = [
    { label: 'Inclusive Opportunities Listed', val: '350+', desc: 'Across tech, hospitality, retail & tailoring' },
    { label: 'Verified Support Resources', val: '120+', desc: 'Government schemes, legal guides & clinics' },
    { label: 'Community Support Centers', val: '45+', desc: 'Across 12 major Indian metropolitan cities' },
    { label: 'Free Skills Programs', val: '80+', desc: 'NSDC & SMILE accredited vocational courses' },
    { label: 'Active Mentors & Advocates', val: '60+', desc: 'Guiding career transitions & enterprise' }
  ];

  const testimonials = [
    {
      quote: "Through Saksham, I applied for the National TG ID card and received it within 30 days without any hospital visits. Now I have enrolled in the FabCraft tailoring associate opening.",
      author: "Pooja K. (Demo Profile)",
      role: "Apparel Artisan, Bengaluru"
    },
    {
      quote: "Saksham's legal guide gave me the exact sections of the 2019 Act to cite when my landlord tried to evict me unlawfully. The DLSA advocate intervened and resolved it within 48 hours.",
      author: "Rehan M. (Demo Profile)",
      role: "Digital Marketing Specialist, Pune"
    },
    {
      quote: "The AI Business Plan Generator helped me calculate equipment costs and apply for a MUDRA loan for my home beauty salon. It turned a distant dream into a real business.",
      author: "Zoya S. (Demo Profile)",
      role: "Salon Entrepreneur, Hyderabad"
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
              <span>AI-Powered Transgender Empowerment Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Empowering Every Identity.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-500 to-accent-600">
                Connecting Every Opportunity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Saksham brings verified employment, free vocational skills, official government welfare schemes, legal rights, community mentorship, and trusted local networks together in one secure, privacy-first technology platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onSelectTab('onboarding')}
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Get Started (Personalized Onboarding)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('jobs')}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Explore Opportunities</span>
              </button>

              <button
                onClick={onOpenAi}
                className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-accent-600/10 to-brand-600/10 hover:from-accent-600/20 hover:to-brand-600/20 text-accent-700 dark:text-accent-300 border border-accent-300 dark:border-accent-700/60 font-bold text-sm flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>Ask Saksham AI</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                100% Privacy & Anonymous Option
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Official Indian Welfare Schemes
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Dignity, Safety & Self-Reliance
              </span>
            </div>
          </div>

          {/* Modern Graphic Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-brand-500/10 via-accent-500/10 to-teal-500/10 border border-brand-200/60 dark:border-slate-700 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  Saksham Engine v1.0
                </span>
              </div>

              {/* Floating UI cards inside illustration */}
              <div className="space-y-3 py-4">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                      💼
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">Inclusive Job Match</h4>
                      <p className="text-[11px] text-slate-500">FabCraft Pattern Master (96% Match)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                      📜
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">National TG Portal ID</h4>
                      <p className="text-[11px] text-slate-500">Self-perceived gender certificate</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
                    MoSJE Portal
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                      ✨
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">Saksham AI Assistant</h4>
                      <p className="text-[11px] text-slate-500">"Tailoring business plan generated"</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                    MUDRA Link
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>Safe • Dignified • Self-Reliant</span>
                <span className="text-brand-600 dark:text-brand-400 font-bold">100% Free & Open</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Saksham? (8 Core Value Modules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider mb-2">
            Holistic Ecosystem
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Saksham?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Saksham is purposefully designed around the practical life needs of transgender individuals in India—moving beyond mere awareness to tangible economic independence and legal safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => onSelectTab(card.tab)}
                className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 mt-2 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore module →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (5 Steps) */}
      <section className="bg-slate-100/70 dark:bg-slate-800/40 py-16 transition-colors border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider mb-2">
              Step-by-Step Pathway
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Saksham Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              From discovering opportunities to securing financial self-reliance, Saksham guides every step with dignified, non-judgmental support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-black text-2xl text-brand-500/30 dark:text-brand-400/20 block mb-2 font-mono">
                    {s.num}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section (Clearly marked demo statistics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-brand-300 uppercase tracking-widest inline-block mb-3 border border-white/10">
              Platform Capacity & Growth (Demo Metrics)
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Scaling Real-World Impact
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Demonstrating the catalog capacity and resource readiness of the Saksham platform across employment, skills, and welfare linkages.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {impactStats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="font-black text-2xl sm:text-4xl text-brand-400 font-mono block mb-1">
                  {st.val}
                </span>
                <span className="font-bold text-xs text-white block mb-1">
                  {st.label}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {st.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-[11px] text-slate-400">
            <em>*Note: Values above represent verified catalog capacity and demo simulation targets to maintain transparency.</em>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly labeled Demo Testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider mb-2">
            Lived Journeys
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Demo Testimonials & Impact Stories
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Clearly labeled demo narratives illustrating real-world use cases of how transgender youth navigate Saksham to achieve self-reliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-card flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t.author}
                </h4>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
