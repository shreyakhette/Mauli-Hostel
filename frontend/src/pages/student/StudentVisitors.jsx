import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Clock, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UserCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { visitorApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import VisitorRequestModal from '../../components/visitor/VisitorRequestModal';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';

export const StudentVisitors = () => {
  const { showToast } = useToast();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await visitorApi.getMy();
      setVisitors(data || []);
    } catch (err) {
      console.error('Failed to load visitor requests', err);
      showToast('Could not load visitor passes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCreateRequest = async (formData) => {
    try {
      await visitorApi.request(formData);
      showToast('Visitor pass request submitted! Security informed.', 'success');
      fetchVisitors();
    } catch (err) {
      showToast('Failed to submit visitor request', 'error');
      throw err;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Visitor Entry Passes</h1>
          <p className="text-surface-muted text-sm mt-1">
            Pre-register parents, guardians, and guests for lounge visits during authorized hours (4:00 PM – 7:00 PM).
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Request Visitor Pass
        </Button>
      </div>

      {/* Visitor Policy Banner */}
      <Card className="bg-wine-50/50 border border-wine-100 p-5">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-wine-700 shrink-0 mt-0.5" />
          <div className="text-xs text-surface-charcoal leading-relaxed">
            <span className="font-bold text-wine-900">Security Regulations: </span>
            All visitors must submit government photo ID (Aadhaar / Voter ID / Driving License) at Gate 1 reception. Male visitors are restricted to the ground-floor visitor lounge and are strictly prohibited from residential wings.
          </div>
        </div>
      </Card>

      {/* Passes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : visitors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No visitor passes requested"
          description="You have not requested any guest passes yet."
          action={
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Issue First Visitor Pass
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visitors.map((visitor) => (
            <Card key={visitor.id} className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-surface-charcoal">{visitor.visitorName}</h3>
                    <span className="text-[11px] font-medium text-surface-muted px-2 py-0.5 bg-surface rounded-full border border-surface-divider">
                      {visitor.relationship}
                    </span>
                  </div>
                  <p className="text-xs text-surface-muted mt-1 flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-wine-600" />
                    {visitor.phone}
                  </p>
                </div>
                <Badge 
                  variant={
                    visitor.status === 'APPROVED' ? 'success' : 
                    visitor.status === 'CHECKED_IN' ? 'primary' :
                    visitor.status === 'CHECKED_OUT' ? 'neutral' :
                    visitor.status === 'REJECTED' ? 'danger' : 'warning'
                  }
                >
                  {visitor.status}
                </Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-surface-divider text-xs space-y-1.5">
                <div className="flex items-center justify-between text-surface-muted">
                  <span>Visit Date:</span>
                  <span className="font-semibold text-surface-charcoal">
                    {new Date(visitor.visitDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-surface-muted">
                  <span>Authorized Hours:</span>
                  <span className="font-medium text-surface-charcoal">{visitor.entryTime} – {visitor.exitTime}</span>
                </div>
                {visitor.purpose && (
                  <div className="flex items-center justify-between text-surface-muted pt-1 border-t border-surface-divider">
                    <span>Purpose:</span>
                    <span className="font-medium text-surface-charcoal">{visitor.purpose}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <VisitorRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
};

export default StudentVisitors;
