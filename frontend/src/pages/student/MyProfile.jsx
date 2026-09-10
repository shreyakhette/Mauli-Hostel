import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Calendar,
  Save,
  CheckCircle2,
  Camera,
  QrCode,
  Sparkles,
  MapPin,
  Building,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import CollegeLogo from '../../components/common/CollegeLogo';

const PRESET_AVATARS = [
  {
    label: 'Ananya (Student Portrait 1)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Priya (Student Portrait 2)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Sneha (Student Portrait 3)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Rhea (Student Portrait 4)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Pooja (Student Portrait 5)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  }
];

export const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [address, setAddress] = useState('');

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getProfile();
      setProfile(data);
      setMobile(data.mobile || '');
      setEmergencyContact(data.emergencyContact || '');
      setGuardianContact(data.guardianContact || '');
      setAddress(data.address || '');
      setSelectedPhoto(data.profilePhotoUrl || '');
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile details', 'error');
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
      const updated = await studentApi.updateProfile({
        mobile,
        emergencyContact,
        guardianContact,
        address
      });
      setProfile(updated);
      updateUserProfile(updated);
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhoto = async () => {
    const photoToSave = customPhotoUrl.trim() || selectedPhoto;
    if (!photoToSave) {
      showToast('Please select or enter a photo URL', 'warning');
      return;
    }

    setSavingPhoto(true);
    try {
      const updated = await studentApi.updateProfile({
        profilePhotoUrl: photoToSave
      });
      setProfile(updated);
      updateUserProfile(updated);
      setIsAvatarModalOpen(false);
      showToast('Profile photo updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile photo', 'error');
    } finally {
      setSavingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-wine-950 via-wine-900 to-rose-900 text-white p-6 sm:p-8 shadow-xl shadow-wine-950/15 relative overflow-hidden">
        {/* Subtle Decorative Background Circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-rose-500/10 pointer-events-none blur-2xl" />
        <div className="absolute right-20 -bottom-16 w-48 h-48 rounded-full bg-amber-400/10 pointer-events-none blur-xl" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          {/* Avatar with Camera Button */}
          <div className="relative group flex-shrink-0">
            {profile?.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.fullName}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-rose-500 to-wine-800 border-4 border-white/20 flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl">
                {profile?.fullName?.charAt(0) || 'S'}
              </div>
            )}
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-wine-950 shadow-lg hover:bg-rose-50 hover:scale-105 transition-all border border-gray-100"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4 text-wine-900" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active Resident
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                ID: {profile?.studentId || 'STU00123'}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                Blood: {profile?.bloodGroup || 'O+'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {profile?.fullName}
            </h1>

            <p className="text-rose-100/90 text-sm font-medium">
              {profile?.department} • {profile?.course} ({profile?.academicYear})
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-rose-200">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-rose-300" />
                Mauli Group of Institutions College of Engineering, Shegaon
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <Home className="w-3.5 h-3.5" />
                Room {profile?.roomNumber || '203'} ({profile?.bedLabel || 'Bed 2'})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Digital Resident ID Card (Printable / Presentable) */}
      <Card className="p-6 sm:p-7 border border-rose-100/70 bg-gradient-to-br from-white via-rose-50/20 to-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <CollegeLogo size="xs" variant="icon" />
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 leading-tight">
                Digital Hostel Resident ID Card
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Mauli Group of Institutions College of Engineering, Shegaon
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Campus ID</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left: Photo and Badge */}
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-wine-800 shadow-md mb-2 bg-gray-100">
              {profile?.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-wine-900 text-white font-bold text-2xl">
                  {profile?.fullName?.charAt(0) || 'S'}
                </div>
              )}
            </div>
            <span className="text-xs font-extrabold text-wine-950 uppercase tracking-wider">
              {profile?.studentId}
            </span>
            <span className="text-[10px] text-gray-500 font-semibold">
              Sakhi Girls Hostel
            </span>
          </div>

          {/* Middle: Details */}
          <div className="space-y-2.5 text-xs text-gray-700 md:col-span-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Full Name</span>
                <span className="font-bold text-gray-900 text-sm">{profile?.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Hostel Allocation</span>
                <span className="font-extrabold text-wine-900 text-sm">Room {profile?.roomNumber} • {profile?.bedLabel}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Department</span>
                <span className="font-semibold text-gray-800">{profile?.department}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">College Affiliation</span>
                <span className="font-semibold text-gray-800">MGICOET Shegaon</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Blood Group</span>
                <span className="font-bold text-rose-600">{profile?.bloodGroup || 'O+'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Guardian Contact</span>
                <span className="font-semibold text-gray-800">{profile?.guardianContact || '+91 98330 99112'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
              <span>Authority: Kranti Bhoyar (Chief Warden)</span>
              <span>Academic Year: 2025-2026</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Editable Contact & Safety Details */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Personal & Emergency Contacts</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Keep emergency phone numbers current for 24/7 security dispatch and warden notifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="text-xs text-rose-700 font-bold hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" /> Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Name (Official Record)"
              value={profile?.fullName || ''}
              disabled
              icon={User}
            />

            <Input
              label="Hostel System ID"
              value={profile?.studentId || ''}
              disabled
              icon={ShieldCheck}
            />

            <Input
              label="Registered Email"
              value={profile?.email || ''}
              disabled
              icon={Mail}
            />

            <Input
              label="Resident Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98330 44556"
              icon={Phone}
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Guardian & Emergency Helpline</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Guardian Name"
                value={profile?.guardianName || ''}
                disabled
                icon={User}
              />

              <Input
                label="Relationship"
                value={profile?.guardianRelationship || 'Father'}
                disabled
              />

              <Input
                label="Guardian Phone"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
                placeholder="+91 98330 99112"
                icon={Phone}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="24x7 Emergency Contact Number"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 98330 99112"
              icon={Phone}
              required
            />

            <Input
              label="Permanent Home Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address, City, State, PIN"
              icon={Home}
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" loading={saving} className="px-6 shadow-md">
              <Save className="w-4 h-4 mr-2" /> Save Contact Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Profile Photo Selector Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Update Profile Photo"
        subtitle="Choose from realistic student portrait presets or paste your own photo URL."
      >
        <div className="space-y-6">
          {/* Preview of current selection */}
          <div className="flex items-center justify-center p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md mx-auto mb-2 bg-gray-100">
                <img
                  src={customPhotoUrl.trim() || selectedPhoto || profile?.profilePhotoUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700">Live Photo Preview</span>
            </div>
          </div>

          {/* Preset Avatars */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Select Preset Portrait
            </label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_AVATARS.map((avatar, idx) => (
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
                    className="w-full h-16 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Or Custom URL */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Or Custom Image URL
            </label>
            <input
              type="url"
              value={customPhotoUrl}
              onChange={(e) => setCustomPhotoUrl(e.target.value)}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-900/20 focus:border-wine-900"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setIsAvatarModalOpen(false)}
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

export default MyProfile;
