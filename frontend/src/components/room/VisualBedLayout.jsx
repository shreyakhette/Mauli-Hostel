import React from 'react';
import { BedDouble, UserPlus, UserMinus, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const VisualBedLayout = ({
  room,
  currentStudentId,
  isWarden = false,
  onAssignBed,
  onUnassignBed,
}) => {
  if (!room || !room.beds) return null;

  return (
    <div className="bg-gradient-to-b from-wine-950/5 via-surface-50 to-white rounded-3xl border border-wine-100 p-6 sm:p-8 shadow-card">
      {/* Room Header inside Blueprint */}
      <div className="text-center pb-6 border-b border-dashed border-wine-200/80 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-wine-800">
          Room Layout Blueprint
        </span>
        <h3 className="text-2xl font-black text-gray-900 mt-0.5 tracking-tight">
          ROOM {room.roomNumber}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge status={room.status} />
          <span className="text-xs font-semibold text-gray-500">
            Floor {room.floor} • {room.occupiedCount} / {room.capacity} Occupied
          </span>
        </div>
      </div>

      {/* 4 Beds Interactive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
        {room.beds.map((bed) => {
          const isOccupied = bed.status === 'OCCUPIED';
          const isMe = currentStudentId && bed.studentId === currentStudentId;

          return (
            <div
              key={bed.id}
              className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isMe
                  ? 'bg-gradient-to-tr from-wine-900 to-rose-700 text-white border-wine-800 shadow-card'
                  : isOccupied
                  ? 'bg-white border-wine-100/80 text-gray-800 shadow-soft hover:border-wine-200'
                  : 'bg-emerald-50/40 border-dashed border-emerald-200 text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              {/* Top bed label and status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isMe
                        ? 'bg-white/20 text-white'
                        : isOccupied
                        ? 'bg-wine-50 text-wine-900'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold tracking-wide ${isMe ? 'text-white' : 'text-gray-900'}`}>
                    {bed.bedLabel}
                  </span>
                </div>
                {isMe ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-wine-900 uppercase tracking-wider">
                    You
                  </span>
                ) : (
                  <Badge status={bed.status} />
                )}
              </div>

              {/* Student info or available status */}
              <div className="my-2">
                {isOccupied ? (
                  <div>
                    <h4 className={`text-sm font-bold truncate ${isMe ? 'text-white' : 'text-gray-900'}`}>
                      {bed.studentName || 'Occupied'}
                    </h4>
                    <p className={`text-xs mt-0.5 truncate ${isMe ? 'text-white/80' : 'text-gray-500'}`}>
                      {bed.studentSystemId || 'Student'} • {bed.studentDepartment || 'Engineering'}
                    </p>
                    {isWarden && bed.studentMobile && (
                      <p className="text-[11px] text-gray-400 mt-1">{bed.studentMobile}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
                      ● Bed Available
                    </p>
                    <p className="text-[11px] text-emerald-600/80 mt-0.5">
                      Ready for warden student allocation
                    </p>
                  </div>
                )}
              </div>

              {/* Warden Action Buttons */}
              {isWarden && (
                <div className="mt-3 pt-3 border-t border-gray-100/60 flex items-center justify-end gap-2">
                  {isOccupied ? (
                    <button
                      onClick={() => onUnassignBed && onUnassignBed(bed.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 border border-rose-200"
                      title="Unassign student"
                    >
                      <UserMinus className="w-3 h-3" /> Unassign
                    </button>
                  ) : (
                    <button
                      onClick={() => onAssignBed && onAssignBed(bed)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200/80 rounded-lg transition flex items-center gap-1"
                      title="Assign student"
                    >
                      <UserPlus className="w-3 h-3" /> Assign
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Verified hostel allocation matrix with biometric access mapping</span>
      </div>
    </div>
  );
};

export default VisualBedLayout;
