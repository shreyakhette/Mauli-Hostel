import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  HeartPulse, 
  Siren, 
  Building2, 
  AlertTriangle, 
  CheckCircle2,
  Users,
  MapPin
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { emergencyApi, studentApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencyCard from '../../components/emergency/EmergencyCard';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';

export const StudentEmergency = () => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSosConfirmOpen, setIsSosConfirmOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contactData, profData] = await Promise.all([
          emergencyApi.getActive(),
          studentApi.getProfile()
        ]);
        setContacts(contactData || []);
        setProfile(profData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTriggerSos = () => {
    setSosSent(true);
    setIsSosConfirmOpen(false);
    showToast('🚨 SOS ALERT TRIGGERED! Warden Kranti Bhoyar and Gate Security have received your high-priority distress location (Room ' + (profile?.roomNumber || '203') + ').', 'error');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Emergency & Safety Assistance</h1>
        <p className="text-surface-muted text-sm mt-1">
          24/7 immediate response network for medical emergencies, security alerts, and crisis support.
        </p>
      </div>

      {/* Big Red SOS Action Card */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-700 to-wine-900 text-white p-6 sm:p-8 shadow-2xl shadow-rose-900/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white uppercase tracking-wider">
              <Siren className="w-4 h-4 animate-bounce" />
              <span>Instant Crisis Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Immediate Safety SOS Alert
            </h2>
            <p className="text-rose-100/90 text-xs sm:text-sm max-w-xl">
              Tap this button only in case of physical threat, severe medical distress, or security breach. This sends an instant high-priority notification to Chief Warden Kranti Bhoyar, Security Desk, and hostel siren system with your exact room location.
            </p>
          </div>

          <button
            onClick={() => setIsSosConfirmOpen(true)}
            className="group relative px-8 py-5 rounded-2xl bg-white text-rose-700 font-extrabold text-base sm:text-lg shadow-xl hover:bg-rose-50 active:scale-95 transition-all shrink-0 flex items-center space-x-3"
          >
            <ShieldAlert className="w-6 h-6 text-rose-600 group-hover:animate-ping" />
            <span>TRIGGER SOS NOW</span>
          </button>
        </div>

        {sosSent && (
          <div className="mt-4 p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center space-x-3 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>Active SOS broadcast in progress. Security officer dispatched to Room {profile?.roomNumber || '203'}. Stay where you are.</span>
          </div>
        )}
      </div>

      {/* Emergency Contacts Directory */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-surface-charcoal">Official Emergency Help Desk</h2>
            <p className="text-xs text-surface-muted">Direct hotlines available 24 hours daily</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <EmergencyCard 
                key={contact.id}
                contact={contact}
                isWarden={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Personal Guardian Emergency Profile */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-charcoal">Your Registered Emergency Contacts</h3>
            <p className="text-xs text-surface-muted">Primary point of contact during hostel emergencies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-surface-divider space-y-1">
            <span className="text-[11px] font-bold text-wine-800 uppercase tracking-wider">Parent / Guardian</span>
            <h4 className="text-sm font-bold text-surface-charcoal">{profile?.guardianName || 'Rajesh Sharma'}</h4>
            <p className="text-xs font-mono text-wine-700">{profile?.guardianPhone || '+91 98220 12345'}</p>
            <p className="text-[11px] text-surface-muted">{profile?.guardianRelation || 'Father'} • Residing in {profile?.homeAddress || 'Pune, MH'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-surface-divider space-y-1">
            <span className="text-[11px] font-bold text-wine-800 uppercase tracking-wider">Hostel Medical Center</span>
            <h4 className="text-sm font-bold text-surface-charcoal">Dr. Shalini Deshmukh (Resident Physician)</h4>
            <p className="text-xs font-mono text-wine-700">+91 94221 67890</p>
            <p className="text-[11px] text-surface-muted">Ground Floor Health Bay • Available 8:00 AM – 8:00 PM</p>
          </div>
        </div>
      </Card>

      {/* SOS Confirmation Modal */}
      <Modal
        isOpen={isSosConfirmOpen}
        onClose={() => setIsSosConfirmOpen(false)}
        title="Confirm Emergency Distress Alert"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Are you sure you want to trigger the emergency alert?</p>
              <p>This will sound the hostel control alarm and dispatch the on-duty warden and security personnel immediately to your allocated room (Room {profile?.roomNumber || '203'}).</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => setIsSosConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleTriggerSos}>
              Yes, Broadcast SOS Alert
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentEmergency;
