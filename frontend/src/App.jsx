import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { NotificationProvider } from './context/NotificationContext';

// Navigation & Layout
import AccessibilityBar from './components/AccessibilityBar';
import DemoSwitcher from './components/DemoSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Modals & Drawers
import SakshamAIChat from './components/SakshamAIChat';
import GlobalSearchModal from './components/GlobalSearchModal';
import EmergencyModal from './components/EmergencyModal';

// Pages
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import SkillsPage from './pages/SkillsPage';
import GovernmentSchemesPage from './pages/GovernmentSchemesPage';
import LegalRightsPage from './pages/LegalRightsPage';
import SupportMapPage from './pages/SupportMapPage';
import CommunityPage from './pages/CommunityPage';
import MentorshipPage from './pages/MentorshipPage';
import BusinessHubPage from './pages/BusinessHubPage';
import SafetyPage from './pages/SafetyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const handleOpenAiWithQuery = (query) => {
    setAiInitialQuery(query);
    setIsAiOpen(true);
  };

  const handleSelectSearchResult = (result, action) => {
    if (action === 'open_search') {
      setIsSearchOpen(true);
      return;
    }
    if (result && result.path) {
      const tab = result.path.split('?')[0].replace('/', '');
      if (tab) setActiveTab(tab);
    }
  };

  return (
    <AuthProvider>
      <AccessibilityProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Top Accessibility Control Bar */}
            <AccessibilityBar />

            {/* Hackathon 6-Demo & Persona Switcher */}
            <DemoSwitcher
              onSelectTab={(tab) => setActiveTab(tab)}
              onOpenAiWithQuery={handleOpenAiWithQuery}
            />

            {/* Responsive Main Navbar */}
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenAi={() => {
                setAiInitialQuery('');
                setIsAiOpen(true);
              }}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            {/* Main Content Router */}
            <main className="flex-1">
              {activeTab === 'landing' && (
                <LandingPage
                  onSelectTab={(tab) => setActiveTab(tab)}
                  onOpenAi={() => {
                    setAiInitialQuery('');
                    setIsAiOpen(true);
                  }}
                />
              )}
              {activeTab === 'onboarding' && (
                <OnboardingPage onComplete={() => setActiveTab('dashboard')} />
              )}
              {activeTab === 'dashboard' && (
                <DashboardPage
                  onSelectTab={(tab) => setActiveTab(tab)}
                  onOpenAi={() => {
                    setAiInitialQuery('');
                    setIsAiOpen(true);
                  }}
                />
              )}
              {activeTab === 'jobs' && <JobsPage />}
              {activeTab === 'skills' && <SkillsPage />}
              {activeTab === 'schemes' && <GovernmentSchemesPage />}
              {activeTab === 'legal' && <LegalRightsPage />}
              {activeTab === 'map' && <SupportMapPage />}
              {activeTab === 'community' && <CommunityPage />}
              {activeTab === 'mentorship' && <MentorshipPage />}
              {activeTab === 'business' && <BusinessHubPage />}
              {activeTab === 'safety' && (
                <SafetyPage onSelectTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'admin' && <AdminDashboardPage />}
            </main>

            {/* Global Footer */}
            <Footer
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

            {/* Floating Saksham AI Drawer */}
            <SakshamAIChat
              isOpen={isAiOpen}
              onClose={() => setIsAiOpen(false)}
              initialQuery={aiInitialQuery}
              onNavigate={(tab) => setActiveTab(tab)}
            />

            {/* Universal Global Search Modal (Ctrl+K) */}
            <GlobalSearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectResult={handleSelectSearchResult}
            />

            {/* Emergency Helplines Pop-up Modal */}
            <EmergencyModal
              isOpen={isEmergencyOpen}
              onClose={() => setIsEmergencyOpen(false)}
              onNavigateToMap={() => {
                setIsEmergencyOpen(false);
                setActiveTab('map');
              }}
            />
          </div>
        </NotificationProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
