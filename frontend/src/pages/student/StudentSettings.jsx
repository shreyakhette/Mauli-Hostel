import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Bell, 
  ShieldCheck, 
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { settingsApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const StudentSettings = () => {
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Preference toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsCurfewAlerts, setSmsCurfewAlerts] = useState(true);
  const [messMenuAlerts, setMessMenuAlerts] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      await settingsApi.changePassword({ oldPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password. Check old password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Account Settings</h1>
        <p className="text-surface-muted text-sm mt-1">
          Manage your portal credentials, notification preferences, and account security.
        </p>
      </div>

      {/* Change Password Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-800 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-charcoal">Change Portal Password</h3>
            <p className="text-xs text-surface-muted">Use a strong password combining uppercase, numbers, and symbols.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
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
            <Button type="submit" loading={loading} className="shadow-md">
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-800 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-charcoal">Notification Preferences</h3>
            <p className="text-xs text-surface-muted">Choose which notifications you wish to receive on SMS & email.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-surface-divider cursor-pointer">
            <div>
              <p className="text-sm font-bold text-surface-charcoal">Curfew & Gate Entry Alerts</p>
              <p className="text-xs text-surface-muted">Instant SMS alert when checked in at gate or approaching 9 PM curfew</p>
            </div>
            <input
              type="checkbox"
              checked={smsCurfewAlerts}
              onChange={(e) => setSmsCurfewAlerts(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-surface-divider cursor-pointer">
            <div>
              <p className="text-sm font-bold text-surface-charcoal">Official Notices & Bulletins</p>
              <p className="text-xs text-surface-muted">Email digests when Warden Kranti Bhoyar posts a notice</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-surface-divider cursor-pointer">
            <div>
              <p className="text-sm font-bold text-surface-charcoal">Daily Mess Menu Updates</p>
              <p className="text-xs text-surface-muted">Morning notification with today's dining schedule</p>
            </div>
            <input
              type="checkbox"
              checked={messMenuAlerts}
              onChange={(e) => setMessMenuAlerts(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};

export default StudentSettings;
