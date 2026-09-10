import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Settings, 
  Clock, 
  Phone, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Save, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { settingsApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Skeleton from '../../components/common/Skeleton';

export const WardenSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // Hostel Config States
  const [hostelName, setHostelName] = useState('Sakhi Girls Hostel');
  const [wardenName, setWardenName] = useState('Kranti Bhoyar');
  const [totalRooms, setTotalRooms] = useState(100);
  const [bedsPerRoom, setBedsPerRoom] = useState(4);
  const [curfewTime, setCurfewTime] = useState('09:00 PM');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactEmail, setContactEmail] = useState('warden@sakhigirlshostel.com');

  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const config = await settingsApi.getHostelConfig();
        if (config) {
          setHostelName(config.hostelName || 'Sakhi Girls Hostel');
          setWardenName(config.wardenName || 'Kranti Bhoyar');
          setTotalRooms(config.totalRooms || 100);
          setBedsPerRoom(config.bedsPerRoom || 4);
          setCurfewTime(config.curfewTime || '09:00 PM');
          setContactPhone(config.contactPhone || '+91 98765 43210');
          setContactEmail(config.contactEmail || 'warden@sakhigirlshostel.com');
        }
      } catch (err) {
        console.warn('Using default settings fallback', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await settingsApi.updateHostelConfig({
        hostelName,
        wardenName,
        totalRooms: Number(totalRooms),
        bedsPerRoom: Number(bedsPerRoom),
        curfewTime,
        contactPhone,
        contactEmail
      });
      showToast('Hostel operational settings and room capacity updated!', 'success');
    } catch (err) {
      showToast('Failed to update hostel configuration', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setChangingPass(true);
    try {
      await settingsApi.changePassword({ oldPassword, newPassword });
      showToast('Warden administrative password updated!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  const calculatedCapacity = Number(totalRooms) * Number(bedsPerRoom);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel System Administration</h1>
        <p className="text-surface-muted text-sm mt-1">
          Configure room and bed capacity, curfew schedules, contact directories, and administrative credentials.
        </p>
      </div>

      {/* Hostel Capacity & Policy Config Form */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-800 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-charcoal">Hostel Scale & Capacity Configuration</h3>
            <p className="text-xs text-surface-muted">Current capacity: 100 rooms × 4 beds = 400 students (fully scalable).</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Hostel Name"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              required
            />

            <Input
              label="Chief Warden Name"
              value={wardenName}
              onChange={(e) => setWardenName(e.target.value)}
              required
            />
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-surface-divider grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Input
              label="Total Rooms"
              type="number"
              min="1"
              max="500"
              value={totalRooms}
              onChange={(e) => setTotalRooms(e.target.value)}
              required
            />

            <Input
              label="Beds Per Room"
              type="number"
              min="1"
              max="8"
              value={bedsPerRoom}
              onChange={(e) => setBedsPerRoom(e.target.value)}
              required
            />

            <div className="text-center sm:text-left pt-2 sm:pt-0">
              <span className="text-xs font-bold uppercase text-surface-muted block">Total Student Capacity</span>
              <span className="text-2xl font-black text-wine-900">{calculatedCapacity} Residents</span>
              <span className="text-[10px] text-surface-muted block">({totalRooms} rooms × {bedsPerRoom} beds)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Hostel Curfew Closing Time"
              value={curfewTime}
              onChange={(e) => setCurfewTime(e.target.value)}
              placeholder="09:00 PM"
              icon={Clock}
              required
            />

            <Input
              label="Warden Helpline Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              icon={Phone}
              required
            />

            <Input
              label="Official Administration Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="warden@sakhigirlshostel.com"
              icon={Mail}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={savingConfig} className="shadow-md">
              <Save className="w-4 h-4 mr-2" /> Save Configuration
            </Button>
          </div>
        </form>
      </Card>

      {/* Security & Password Form */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-800 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-charcoal">Warden Credential Management</h3>
            <p className="text-xs text-surface-muted">Change your administrative account password.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <div className="pt-2">
            <Button type="submit" loading={changingPass} className="shadow-md">
              Update Warden Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WardenSettings;
