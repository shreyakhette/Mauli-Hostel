import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export const ComplaintModal = ({ isOpen, onClose, onSubmit, studentRoom }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WATER');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'WATER', label: 'Water Supply / Leakage' },
    { value: 'ELECTRICITY', label: 'Electricity / Switch / Lights' },
    { value: 'CLEANING', label: 'Cleaning & Housekeeping' },
    { value: 'FOOD', label: 'Mess & Food Quality' },
    { value: 'ROOM', label: 'Room Furniture / Door / Bed' },
    { value: 'BATHROOM', label: 'Bathroom / Geyser / Plumbing' },
    { value: 'INTERNET', label: 'Wi-Fi & Internet Connectivity' },
    { value: 'SECURITY', label: 'Security / Access / Gate' },
    { value: 'MAINTENANCE', label: 'General Maintenance' },
    { value: 'OTHER', label: 'Other Issue' },
  ];

  const priorities = [
    { value: 'LOW', label: 'Low — Normal attention' },
    { value: 'MEDIUM', label: 'Medium — Standard response (Default)' },
    { value: 'HIGH', label: 'High — Needs prompt attention' },
    { value: 'URGENT', label: 'Urgent — Immediate hazard' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        priority,
        description,
        roomNumber: studentRoom || '',
      });
      setTitle('');
      setDescription('');
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raise a Maintenance Complaint"
      subtitle="Submit an issue report directly to Warden Kranti Bhoyar and technical staff"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Complaint Title"
          required
          placeholder="e.g. Water leakage under wash basin"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            required
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Select
            label="Priority Level"
            required
            options={priorities}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, exact location in the room, and when it began..."
            className="w-full rounded-xl border border-gray-200 p-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!title || !description || submitting}
            isLoading={submitting}
          >
            Submit Complaint Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ComplaintModal;
