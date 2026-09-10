import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Calendar, MapPin, Phone, FileText } from 'lucide-react';

export const LeaveApplicationForm = ({ onSubmit, defaultGuardianContact = '' }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [destination, setDestination] = useState('');
  const [guardianContact, setGuardianContact] = useState(defaultGuardianContact);
  const [reason, setReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(toDate) < new Date(fromDate)) {
      setDateError('Return date cannot be earlier than departure date');
      return;
    }
    setDateError('');

    setSubmitting(true);
    try {
      await onSubmit({
        fromDate,
        toDate,
        destination,
        guardianContact,
        reason,
        additionalNotes,
      });
      // reset
      setFromDate('');
      setToDate('');
      setDestination('');
      setReason('');
      setAdditionalNotes('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Apply for Out-Station Leave</h3>
        <p className="text-xs text-gray-500 mt-1">
          Hostel policy requires parental notification and Warden Kranti Bhoyar approval prior to departure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Departure Date (From)"
            type="date"
            required
            icon={Calendar}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <Input
            label="Return Date (To)"
            type="date"
            required
            icon={Calendar}
            value={toDate}
            error={dateError}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Travel Destination"
            placeholder="e.g. Home, Pune, Maharashtra"
            required
            icon={MapPin}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <Input
            label="Guardian Emergency Contact"
            placeholder="+91 98765 43210"
            required
            icon={Phone}
            value={guardianContact}
            onChange={(e) => setGuardianContact(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Reason for Leave <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Attending family function, medical appointment, festival"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Additional Notes & Travel Mode
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Train reservation details, accompanying family member..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 resize-none"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
            isLoading={submitting}
          >
            Submit Application for Approval
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LeaveApplicationForm;
