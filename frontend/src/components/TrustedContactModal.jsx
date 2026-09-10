import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { Shield, Send, CheckCircle2, AlertTriangle, X, MapPin } from 'lucide-react';

export default function TrustedContactModal({ isOpen, onClose }) {
  const { addToast } = useNotification();
  const [contactName, setContactName] = useState(() => localStorage.getItem('saksham_contact_name') || '');
  const [contactPhone, setContactPhone] = useState(() => localStorage.getItem('saksham_contact_phone') || '');
  const [shareLocation, setShareLocation] = useState(false);
  const [locCoordinates, setLocCoordinates] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(() => Boolean(localStorage.getItem('saksham_contact_name')));

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      addToast('Location Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setShareLocation(true);
        setLocLoading(false);
        addToast('Location Acquired', 'Temporary location will be included in the alert.', 'success');
      },
      (err) => {
        setLocLoading(false);
        addToast('Permission Denied', 'Location access was not granted.', 'error');
      }
    );
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      addToast('Validation Error', 'Please enter both contact name and phone number.', 'error');
      return;
    }
    localStorage.setItem('saksham_contact_name', contactName.trim());
    localStorage.setItem('saksham_contact_phone', contactPhone.trim());
    setIsSaved(true);
    addToast('Trusted Contact Saved', 'Your emergency contact has been configured.', 'success');
  };

  const handleSendAlert = () => {
    if (!contactPhone) {
      addToast('Missing Contact', 'Please save a trusted contact first.', 'error');
      return;
    }

    let alertText = `EMERGENCY ALERT: I am in need of urgent assistance. Please check in on me immediately. Sent via Saksham Safety Center.`;
    if (shareLocation && locCoordinates) {
      alertText += ` My current location is: https://maps.google.com/?q=${locCoordinates.lat},${locCoordinates.lng}`;
    }

    // Open WhatsApp / SMS URI
    const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(alertText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    addToast('Alert Dispatched', `Emergency alert opened for ${contactName}.`, 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-sm">Trusted Contact & Quick Alert Setup</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-900 dark:text-brand-200 text-xs">
            <strong>Privacy Guarantee:</strong> Your trusted contact is stored locally on this device only. Saksham never conducts hidden background tracking or unauthorized data transmission.
          </div>

          <form onSubmit={handleSaveContact} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trusted Contact Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Maya, Friend, Sibling"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (with Country Code)
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow transition-colors"
              >
                {isSaved ? 'Update Saved Contact' : 'Save Trusted Contact'}
              </button>
            </div>
          </form>

          {/* Quick Dispatch Section */}
          {isSaved && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Include GPS Location in Alert?
                </span>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={locLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{locLoading ? 'Locating...' : locCoordinates ? 'Location Attached' : 'Attach GPS Location'}</span>
                </button>
              </div>

              <button
                onClick={handleSendAlert}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Urgent Alert to {contactName}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
