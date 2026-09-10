import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import QuickExitButton from './QuickExitButton';
import {
  Briefcase,
  GraduationCap,
  FileCheck,
  Scale,
  MapPin,
  Users,
  UserCheck,
  Sparkles,
  Shield,
  Search,
  Bell,
  Menu,
  X,
  Building2,
  LayoutDashboard,
  ShieldAlert,
  PhoneCall
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAi, onOpenSearch, onOpenEmergency }) {
  const { user, isAdmin, isEmployer } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Opportunities', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'schemes', label: 'Government Schemes', icon: FileCheck },
    { id: 'legal', label: 'Legal Rights', icon: Scale },
    { id: 'map', label: 'Support Map', icon: MapPin },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'mentorship', label: 'Mentorship', icon: UserCheck },
    { id: 'business', label: 'Business Hub', icon: Building2 },
    { id: 'safety', label: 'Safety & Helplines', icon: Shield }
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-accent-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 transform transition-transform hover:scale-105">
              <span className="font-black text-xl tracking-tight">स</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  SAKSHAM
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                  Social Tech
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Empowering Every Identity
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === link.id
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-sm border border-brand-200/60 dark:border-brand-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Global Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Global Search across jobs, schemes, legal, map (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Saksham AI Assistant Button */}
            <button
              onClick={onOpenAi}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-500 hover:to-brand-500 text-white text-xs font-bold shadow-md shadow-accent-600/20 transition-all transform hover:scale-[1.02]"
              title="Open Saksham AI Virtual Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Saksham AI</span>
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
              title="Official Emergency Helplines (1800-200-1122 / 112)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden md:inline">Helpline: 1800-200-1122</span>
            </button>

            {/* Notifications Tray */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">Notifications</span>
                    <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-400 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) {
                              const tab = n.link.replace('/', '');
                              if (tab) setActiveTab(tab);
                            }
                            setNotifOpen(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                            !n.is_read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</h5>
                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Exit Safety Button */}
            <QuickExitButton />

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-brand-500" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
