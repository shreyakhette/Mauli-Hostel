import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MessageSquare, Clock, AlertTriangle, Wrench, CheckCircle2 } from 'lucide-react';

export const ComplaintCard = ({ complaint, onClick }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'WATER': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'ELECTRICITY': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'CLEANING': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'FOOD': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'ROOM': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'BATHROOM': return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'INTERNET': return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'SECURITY': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'MAINTENANCE': return 'text-violet-700 bg-violet-50 border-violet-200';
      default: return 'text-purple-700 bg-purple-50 border-purple-200';
    }
  };

  return (
    <Card hover onClick={() => onClick && onClick(complaint)} className="p-5 flex flex-col justify-between h-full border hover:border-wine-300 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold uppercase tracking-wider text-surface-muted">
              <span className="text-wine-800 font-mono font-black">{complaint.ticketNumber}</span>
              <span>•</span>
              <span className="text-surface-charcoal">{complaint.roomNumber ? `Room ${complaint.roomNumber}` : 'General'}</span>
              {complaint.studentName && (
                <>
                  <span>•</span>
                  <span className="text-wine-700 font-semibold truncate max-w-[140px]">{complaint.studentName}</span>
                </>
              )}
            </div>
            <h4 className="text-sm font-bold text-surface-charcoal mt-1 leading-snug line-clamp-1">
              {complaint.title}
            </h4>
          </div>
          <Badge status={complaint.status} />
        </div>

        <p className="text-xs text-surface-muted line-clamp-2 mb-3 leading-relaxed">
          {complaint.description}
        </p>

        {/* Assigned Technician Tag if any */}
        {complaint.assignedTo && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
            <Wrench className="w-3 h-3 text-slate-500" />
            <span>Assigned: <strong className="text-slate-900">{complaint.assignedTo}</strong></span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-surface-divider flex items-center justify-between text-xs text-surface-muted">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getCategoryColor(complaint.category)}`}>
            {complaint.category}
          </span>
          {complaint.priority === 'HIGH' || complaint.priority === 'URGENT' ? (
            <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              complaint.priority === 'URGENT' 
                ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse' 
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              <AlertTriangle className="w-3 h-3" /> {complaint.priority}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {complaint.comments && complaint.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-surface-charcoal font-semibold bg-surface px-1.5 py-0.5 rounded">
              <MessageSquare className="w-3 h-3 text-wine-600" /> {complaint.comments.length}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-surface-muted">
            <Clock className="w-3 h-3" />
            {new Date(complaint.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ComplaintCard;
