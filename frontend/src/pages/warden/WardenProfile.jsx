import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Camera,
  Clock,
  Building,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { wardenApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import CollegeLogo from '../../components/common/CollegeLogo';

const WARDEN_AVATAR_PRESETS = [
  {
    label: 'Formal Educator Portrait 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Administrator Portrait 2',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Faculty Member Portrait 3',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80'
  }
];

export const WardenProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('Kranti Bhoyar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [designation, setDesignation] = useState('Chief Warden');
  const [officeHours, setOfficeHours] = useState('9:00 AM - 6:00 PM (Emergency 24x7)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43211');

  // Photo Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await wardenApi.getProfile();
      setProfile(data);
      if (data) {
        setFullName(data.fullName || 'Kranti Bhoyar');
        setPhone(data.phone || '+91 98765 43210');
        setDesignation(data.designation || 'Chief Warden');
        setOfficeHours(data.officeHours || '9:00 AM - 6:00 PM (Emergency 24x7)');
        setEmergencyPhone(data.emergencyPhone || '+91 98765 43211');
        setSelectedPhoto(data.profilePhotoUrl || '');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load warden profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await wardenApi.updateProfile({
        fullName,
        phone,
        designation,
        officeHours,
        emergencyPhone,
        profilePhotoUrl: profile?.profilePhotoUrl
      });
      setProfile(updated);
      updateUserProfile(updated);
      showToast('Warden administrative profile saved!', 'success');
    } catch (err) {
      showToast('Failed to update warden profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhoto = async () => {
    const photoToSave = customPhotoUrl.trim() || selectedPhoto;
    if (!photoToSave) {
      showToast('Please select or enter an image URL', 'warning');
      return;
    }

    setSavingPhoto(true);
    try {
      const updated = await wardenApi.updateProfile({
        profilePhotoUrl: photoToSave
      });
      setProfile(updated);
      updateUserProfile(updated);
      setIsPhotoModalOpen(false);
      showToast('Chief Warden profile photo updated!', 'success');
    } catch (err) {
      showToast('Failed to update photo', 'error');
    } finally {
      setSavingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-52 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-wine-950 via-wine-900 to-rose-900 text-white p-6 sm:p-8 shadow-xl shadow-wine-950/15 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-rose-500/10 pointer-events-none blur-2xl" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          <div className="relative group flex-shrink-0">
            {profile?.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.fullName}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-rose-500 to-wine-800 border-4 border-white/20 flex items-center justify-center text-white text-3xl font-serif font-bold shadow-xl">
                KB
              </div>
            )}
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-wine-950 shadow-lg hover:bg-rose-50 hover:scale-105 transition-all border border-gray-100"
              title="Update Photo"
            >
              <Camera className="w-4 h-4 text-wine-900" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Chief Warden & Head of Student Safety
            </div>
            <h1 className="text-3xl font-serif font-bold">{fullName}</h1>
            <p className="text-rose-100/90 text-sm font-medium">
              Sakhi Girls Hostel • Mauli Group of Institutions College of Engineering, Shegaon
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-rose-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" /> {officeHours}
              </span>
              <span className="flex items-center gap-1.5 text-amber-200 font-bold">
                <Phone className="w-3.5 h-3.5" /> Emergency: {emergencyPhone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Credentials Card */}
      <Card className="p-6 border border-rose-100 bg-gradient-to-br from-white to-rose-50/20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CollegeLogo size="sm" />
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Hostel Rooms</span>
              <span className="text-lg font-bold text-wine-950">100 Rooms</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Capacity</span>
              <span className="text-lg font-bold text-wine-950">400 Beds</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Campus Status</span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                Active & Monitored
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Administrative Details Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Administrative Contact & Office Information</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                These coordinates are published to student dashboards and emergency response panels.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="text-xs text-rose-700 font-bold hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" /> Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Warden Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={User}
              required
            />

            <Input
              label="Designation / Role"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              icon={Award}
              required
            />

            <Input
              label="Administrative Email"
              value={profile?.email || 'warden.kranti@sakhihostel.com'}
              disabled
              icon={Mail}
            />

            <Input
              label="Direct Mobile Helpline"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Office Hours & Availability"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              icon={Clock}
              required
            />

            <Input
              label="24x7 Emergency Contact Number"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              icon={Phone}
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" loading={saving} className="px-6 shadow-md">
              <Save className="w-4 h-4 mr-2" /> Save Administrative Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Profile Photo Selector Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Update Chief Warden Portrait"
        subtitle="Select a professional portrait preset or enter a custom photo URL."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md mx-auto mb-2 bg-gray-100">
                <img
                  src={customPhotoUrl.trim() || selectedPhoto || profile?.profilePhotoUrl}
                  alt="Warden Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700">Chief Warden Photo Preview</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Preset Portraits
            </label>
            <div className="grid grid-cols-3 gap-3">
              {WARDEN_AVATAR_PRESETS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(avatar.url);
                    setCustomPhotoUrl('');
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                    selectedPhoto === avatar.url && !customPhotoUrl
                      ? 'border-wine-900 ring-2 ring-wine-900/30 scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  title={avatar.label}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.label}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <span className="text-[10px] text-gray-600 block mt-1 truncate">
                    {avatar.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Or Custom Image URL
            </label>
            <input
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="https://example.com/warden-photo.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-900/20 focus:border-wine-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsPhotoModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePhoto}
              loading={savingPhoto}
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WardenProfile;
