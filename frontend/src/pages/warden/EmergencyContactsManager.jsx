import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Phone, 
  Trash2, 
  Edit3, 
  Building2, 
  HeartPulse, 
  Siren, 
  Radio, 
  Flame
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { emergencyApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import EmergencyCard from '../../components/emergency/EmergencyCard';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const EmergencyContactsManager = () => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [is24x7, setIs24x7] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await emergencyApi.getAll();
      setContacts(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load emergency contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreateContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await emergencyApi.create({
        title,
        phoneNumber,
        description,
        is24x7,
        isActive: true
      });
      showToast('Emergency contact added to active directory!', 'success');
      setTitle('');
      setPhoneNumber('');
      setDescription('');
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      showToast('Failed to create contact', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this emergency directory entry?')) return;
    try {
      await emergencyApi.delete(id);
      showToast('Emergency contact removed', 'success');
      fetchContacts();
    } catch (err) {
      showToast('Failed to delete contact', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Emergency Directory & Crisis Hub</h1>
          <p className="text-surface-muted text-sm mt-1">
            Maintain high-priority emergency hotlines, hospital tie-ups, ambulance services, and local police station contacts.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Add Emergency Hotline
        </Button>
      </div>

      {/* Grid of Emergency Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No emergency contacts configured"
          description="Click Add Emergency Hotline to configure critical contact numbers."
          action={
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Add Contact
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="relative group">
              <EmergencyCard 
                contact={contact}
                isWarden={true}
              />
              <button
                onClick={() => handleDelete(contact.id)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-surface-muted hover:text-rose-600 shadow-sm transition-all"
                title="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Emergency Directory Hotline"
        subtitle="Numbers configured here appear with one-touch dialing on all student devices"
      >
        <form onSubmit={handleCreateContact} className="space-y-4">
          <Input
            label="Service / Authority Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Apollo Hospital Casualty & Ambulance"
            required
          />

          <Input
            label="Emergency Contact Phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 102 / +91 98220 99999"
            icon={Phone}
            required
          />

          <Input
            label="Location & Availability Details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 1.5 km from hostel gate • 24/7 Trauma ICU"
            required
          />

          <label className="flex items-center space-x-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={is24x7}
              onChange={(e) => setIs24x7(e.target.checked)}
              className="w-4 h-4 text-wine-600 rounded border-gray-300 focus:ring-wine-500"
            />
            <span className="text-xs font-semibold text-surface-charcoal">
              Available 24 Hours / 7 Days a week
            </span>
          </label>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-divider">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Hotline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyContactsManager;
