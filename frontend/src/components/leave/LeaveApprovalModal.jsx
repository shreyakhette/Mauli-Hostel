import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircle2, XCircle, Calendar, MapPin, Phone } from 'lucide-react';

export const LeaveApprovalModal = ({ isOpen, onClose, leave, onReview }) => {
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!leave) return null;

  const handleAction = async (status) => {
    setSubmitting(true);
    try {
      await onReview(leave.id, { status, remarks });
      setRemarks('');
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
      title="Review Leave Application"
      subtitle={`Student: ${leave.studentName} (${leave.studentSystemId}) • Room ${leave.roomNumber}`}
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-surface-50 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Calendar className="w-4 h-4 text-wine-800 flex-shrink-0" />
            <span className="font-semibold">{leave.fromDate}</span> to <span className="font-semibold">{leave.toDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <MapPin className="w-4 h-4 text-wine-800 flex-shrink-0" />
            <span>Destination: <strong>{leave.destination}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Phone className="w-4 h-4 text-wine-800 flex-shrink-0" />
            <span>Guardian Contact: <strong>{leave.guardianContact}</strong></span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Reason</span>
          <p className="text-sm text-gray-900 font-medium mt-0.5">{leave.reason}</p>
          {leave.additionalNotes && (
            <p className="text-xs text-gray-500 mt-1 italic">{leave.additionalNotes}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase">
            Warden Approval Remarks / Conditions
          </label>
          <input
            type="text"
            placeholder="e.g. Approved. Confirm arrival via phone call."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button
            variant="danger"
            size="sm"
            icon={XCircle}
            isLoading={submitting}
            onClick={() => handleAction('REJECTED')}
          >
            Reject Application
          </Button>

          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            isLoading={submitting}
            onClick={() => handleAction('APPROVED')}
          >
            Approve Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveApprovalModal;
