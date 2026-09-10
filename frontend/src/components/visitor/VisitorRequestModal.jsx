import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Calendar, Clock, Phone, User } from 'lucide-react';

export const VisitorRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [visitorName, setVisitorName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [entryTime, setEntryTime] = useState('04:00 PM');
  const [exitTime, setExitTime] = useState('06:00 PM');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const relationships = [
    { value: 'Parent', label: 'Parent / Guardian' },
    { value: 'Sibling', label: 'Sibling (Brother / Sister)' },
    { value: 'Relative', label: 'Relative' },
    { value: 'Friend', label: 'College Friend / Classmate' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        visitorName,
        relationship,
        phone,
        visitDate,
        entryTime,
        exitTime,
        purpose,
      });
      setVisitorName('');
      setPhone('');
      setPurpose('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Visitor Pass"
      subtitle="Visitor entry requires mandatory registration and hostel security verification"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Visitor Full Name"
            placeholder="e.g. Meera Sharma"
            required
            icon={User}
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
          />

          <Select
            label="Relationship"
            required
            options={relationships}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Visitor Mobile Number"
            placeholder="+91 98765 43210"
            required
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Visit Date"
            type="date"
            required
            icon={Calendar}
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Expected Entry Time"
            placeholder="04:00 PM"
            required
            icon={Clock}
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
          />

          <Input
            label="Expected Departure"
            placeholder="06:00 PM"
            icon={Clock}
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Purpose of Visit <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Delivering luggage, academic project discussion, birthday visit"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
            Submit Visitor Pass
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VisitorRequestModal;
