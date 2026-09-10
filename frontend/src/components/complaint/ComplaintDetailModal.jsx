import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Select } from '../common/Select';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  ShieldAlert, 
  CheckCircle,
  AlertCircle,
  UserCheck,
  Zap
} from 'lucide-react';

const MAINTENANCE_STAFF = [
  { name: 'Santosh (Plumber)', note: 'Plumber Santosh dispatched for inspection.' },
  { name: 'Ramesh (Electrician)', note: 'Electrician Ramesh assigned to inspect wiring & switches.' },
  { name: 'Vinod (Carpenter)', note: 'Carpenter Vinod assigned for room furniture repair.' },
  { name: 'Campus IT Team', note: 'Mauli IT network engineer assigned for Wi-Fi inspection.' },
  { name: 'Housekeeping Team', note: 'Sanitation & cleaning staff deployed.' }
];

export const ComplaintDetailModal = ({
  isOpen,
  onClose,
  complaint,
  isWarden = false,
  onUpdateStatus,
  onAddComment,
}) => {
  const [newStatus, setNewStatus] = useState(complaint?.status || 'OPEN');
  const [remarks, setRemarks] = useState(complaint?.resolutionRemarks || '');
  const [commentText, setCommentText] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!complaint) return null;

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setSubmittingStatus(true);
    try {
      await onUpdateStatus(complaint.id, {
        status: newStatus,
        resolutionRemarks: remarks,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleQuickAssign = async (staff) => {
    setNewStatus('IN_PROGRESS');
    setRemarks(staff.note);
    setSubmittingStatus(true);
    try {
      await onUpdateStatus(complaint.id, {
        status: 'IN_PROGRESS',
        resolutionRemarks: staff.note,
      });
      // Also record an official comment
      await onAddComment(complaint.id, `[Official Assignment]: ${staff.note}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await onAddComment(complaint.id, commentText);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const statusOptions = [
    { value: 'OPEN', label: 'OPEN — Logged & Awaiting Review' },
    { value: 'IN_PROGRESS', label: 'IN_PROGRESS — Maintenance Staff Dispatched' },
    { value: 'RESOLVED', label: 'RESOLVED — Issue Fixed & Inspected' },
    { value: 'REJECTED', label: 'REJECTED — Invalid / Not Feasible' },
  ];

  // Calculate current workflow step (1 to 4)
  const getWorkflowStep = () => {
    if (complaint.status === 'RESOLVED') return 4;
    if (complaint.status === 'IN_PROGRESS') return 3;
    if (complaint.comments && complaint.comments.length > 0) return 2;
    return 1;
  };

  const currentStep = getWorkflowStep();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={complaint.title}
      subtitle={`Ticket ${complaint.ticketNumber} • Registered on ${new Date(complaint.createdAt).toLocaleDateString([], { dateStyle: 'medium' })}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Status Stepper Progress Bar */}
        <div className="p-4 rounded-2xl bg-surface-50 border border-gray-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-3">
            Resolution Progress
          </span>
          <div className="grid grid-cols-4 gap-2 relative">
            <div className={`text-center p-2 rounded-xl border ${
              currentStep >= 1 ? 'bg-rose-50 border-rose-200 text-rose-900 font-bold' : 'bg-white border-gray-100 text-gray-400'
            }`}>
              <div className="text-[10px] uppercase tracking-wider">Step 1</div>
              <div className="text-xs mt-0.5">Logged</div>
            </div>

            <div className={`text-center p-2 rounded-xl border ${
              currentStep >= 2 ? 'bg-rose-50 border-rose-200 text-rose-900 font-bold' : 'bg-white border-gray-100 text-gray-400'
            }`}>
              <div className="text-[10px] uppercase tracking-wider">Step 2</div>
              <div className="text-xs mt-0.5">Reviewed</div>
            </div>

            <div className={`text-center p-2 rounded-xl border ${
              currentStep >= 3 ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold' : 'bg-white border-gray-100 text-gray-400'
            }`}>
              <div className="text-[10px] uppercase tracking-wider">Step 3</div>
              <div className="text-xs mt-0.5">In Progress</div>
            </div>

            <div className={`text-center p-2 rounded-xl border ${
              currentStep >= 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-gray-100 text-gray-400'
            }`}>
              <div className="text-[10px] uppercase tracking-wider">Step 4</div>
              <div className="text-xs mt-0.5">Resolved</div>
            </div>
          </div>
        </div>

        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface-50 border border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
              Student / Room
            </span>
            <p className="text-xs font-bold text-gray-900 mt-0.5">
              {complaint.studentName || 'Resident Student'} ({complaint.studentSystemId || 'STU'}) • Room {complaint.roomNumber || 'General'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {complaint.category}
            </span>
            <Badge status={complaint.status} />
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Problem Description
          </h5>
          <p className="text-sm text-gray-800 bg-white p-4 rounded-xl border border-gray-100 leading-relaxed shadow-xs">
            {complaint.description}
          </p>
        </div>

        {/* Official Resolution Remarks if present */}
        {complaint.resolutionRemarks && (
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Warden Resolution & Action Note</span>
              {complaint.resolvedAt && (
                <span className="text-[10px] font-normal text-emerald-700 ml-auto">
                  Resolved on {new Date(complaint.resolvedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed mt-1 font-medium">
              {complaint.resolutionRemarks}
            </p>
          </div>
        )}

        {/* Warden Management & Action Controls */}
        {isWarden && (
          <div className="p-4 rounded-2xl bg-wine-50/50 border border-wine-100 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-wine-950 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-wine-800" />
                Warden Action & Staff Dispatch
              </h5>
              <span className="text-[10px] text-wine-700 font-semibold">Chief Warden Kranti Bhoyar</span>
            </div>

            {/* Quick Assign Buttons */}
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                1-Click Maintenance Staff Assignment:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MAINTENANCE_STAFF.map((staff, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickAssign(staff)}
                    disabled={submittingStatus}
                    className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-[11px] font-semibold text-wine-900 hover:bg-rose-100 hover:border-rose-300 transition-all shadow-xs"
                  >
                    ⚡ {staff.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Formal Status & Remarks Form */}
            <form onSubmit={handleStatusSubmit} className="space-y-3 pt-2 border-t border-rose-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Update Ticket Status"
                  options={statusOptions}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase">
                    Official Resolution / Status Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technician attended and replaced valve"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-wine-900/20"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="sm" loading={submittingStatus}>
                  Save Status & Inform Resident
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Ticket Conversation / Message History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-wine-800" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Ticket Conversation ({complaint.comments ? complaint.comments.length : 0})
            </h5>
          </div>

          <div className="space-y-2.5 max-h-52 overflow-y-auto mb-3 pr-1">
            {complaint.comments && complaint.comments.length > 0 ? (
              complaint.comments.map((comment) => {
                const isFromWarden = comment.authorRole === 'WARDEN';
                return (
                  <div 
                    key={comment.id} 
                    className={`p-3 rounded-xl border ${
                      isFromWarden 
                        ? 'bg-rose-50/70 border-rose-100 text-rose-950 ml-4' 
                        : 'bg-surface-50 border-gray-100 text-gray-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <User className="w-3 h-3 text-gray-400" />
                        {comment.authorName}{' '}
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isFromWarden ? 'bg-wine-900 text-white' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {isFromWarden ? 'Chief Warden' : 'Resident'}
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{comment.comment}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 text-center py-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                No follow-up messages yet. Use the message box below to communicate.
              </p>
            )}
          </div>

          {/* Add Message / Reply */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder={isWarden ? "Send note to resident student..." : "Reply to Warden Kranti Bhoyar..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!commentText.trim() || submittingComment}
              loading={submittingComment}
            >
              <Send className="w-3.5 h-3.5 mr-1" /> Send
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ComplaintDetailModal;
