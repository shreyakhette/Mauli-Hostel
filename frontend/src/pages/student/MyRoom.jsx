import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Wind, 
  Wifi, 
  Zap, 
  KeyRound, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi, roomApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import VisualBedLayout from '../../components/room/VisualBedLayout';
import Skeleton from '../../components/common/Skeleton';

export const MyRoom = () => {
  const { user } = useAuth();
  const [roomData, setRoomData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const studProfile = await studentApi.getProfile();
        setProfile(studProfile);
        
        const roomNum = studProfile?.roomNumber || user?.roomNumber || '203';
        const roomRes = await roomApi.getByNumber(roomNum);
        setRoomData(roomRes);
      } catch (err) {
        console.error('Failed to load room details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  const roommates = roomData?.beds?.filter(b => b.status === 'OCCUPIED') || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-wine-900 to-rose-800 text-white p-6 sm:p-8 shadow-xl shadow-wine-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-rose-100 mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>Sakhi Residency Wing B • Floor {roomData?.floor || 2}</span>
            </div>
            <h1 className="text-3xl font-serif font-bold">Room {roomData?.roomNumber || '203'}</h1>
            <p className="text-rose-100/90 text-sm mt-1">
              Quad Occupancy Suite (4 Beds) • {roomData?.occupiedCount || 3} of {roomData?.capacity || 4} Beds Occupied
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-wine-900 shadow-sm">
              Your Allocation: {profile?.bedLabel || 'Bed 2'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Visual 4-Bed Blueprint */}
        <div className="lg:col-span-2 space-y-6">
          <VisualBedLayout 
            room={roomData} 
            currentStudentId={profile?.studentId || user?.studentId}
            isWarden={false}
          />

          {/* Room Inventory & Amenities Checklist */}
          <Card>
            <h3 className="text-base font-bold text-surface-charcoal mb-4 flex items-center">
              <Sparkles className="w-4 h-4 text-wine-600 mr-2" />
              Room Inclusions & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-2xl bg-surface border border-surface-divider flex flex-col items-center text-center">
                <Wifi className="w-6 h-6 text-wine-600 mb-2" />
                <span className="text-xs font-semibold text-surface-charcoal">High-Speed Wi-Fi</span>
                <span className="text-[10px] text-surface-muted">SSID: Sakhi_WingB_5G</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-surface-divider flex flex-col items-center text-center">
                <Wind className="w-6 h-6 text-wine-600 mb-2" />
                <span className="text-xs font-semibold text-surface-charcoal">Ventilation & Fans</span>
                <span className="text-[10px] text-surface-muted">Dual ceiling fans</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-surface-divider flex flex-col items-center text-center">
                <Zap className="w-6 h-6 text-wine-600 mb-2" />
                <span className="text-xs font-semibold text-surface-charcoal">Power Backup</span>
                <span className="text-[10px] text-surface-muted">24/7 DG generator</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-surface-divider flex flex-col items-center text-center">
                <KeyRound className="w-6 h-6 text-wine-600 mb-2" />
                <span className="text-xs font-semibold text-surface-charcoal">Lockable Storage</span>
                <span className="text-[10px] text-surface-muted">Godrej wardrobes</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Roommates & Policy */}
        <div className="space-y-6">
          {/* Roommates Card */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-wine-600" />
              <h3 className="text-base font-bold text-surface-charcoal">Room Co-Residents</h3>
            </div>

            <div className="space-y-3">
              {roommates.map((bed) => {
                const isMe = (profile?.studentId && bed.studentId === profile.studentId) || bed.studentName === profile?.fullName;
                return (
                  <div 
                    key={bed.id} 
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isMe 
                        ? 'bg-wine-50/70 border-wine-200' 
                        : 'bg-surface border-surface-divider'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-surface-charcoal">{bed.studentName}</h4>
                          {isMe && (
                            <span className="text-[10px] bg-wine-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-surface-muted mt-0.5">
                          {bed.bedLabel} • {bed.studentDepartment || 'Computer Engineering'}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white border border-surface-divider text-surface-muted">
                        {bed.studentRollNo || bed.studentSystemId || '2026-CS'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Daily Cleaning & Inspection Notice */}
          <Card className="bg-wine-50/40 border border-wine-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-wine-900 mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-wine-600 mr-1.5" />
              Housekeeping Schedule
            </h3>
            <p className="text-xs text-surface-charcoal leading-relaxed">
              Daily room cleaning is performed between <span className="font-semibold">10:00 AM – 12:00 PM</span>. Please ensure personal items are stowed in assigned wardrobes.
            </p>
            <div className="mt-3 pt-3 border-t border-wine-100 text-[11px] text-surface-muted space-y-1">
              <p>• Waste bins cleared: Daily 10:30 AM</p>
              <p>• Linen wash service: Every Saturday</p>
              <p>• Floor inspection: Every Wednesday</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyRoom;
