import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Phone,
  Sparkles
} from 'lucide-react';
import { busApi } from '../../api/services';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import BusCard from '../../components/bus/BusCard';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';

export const StudentBus = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('ALL');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await busApi.getAllSchedules();
        setSchedules(data || []);
      } catch (err) {
        console.error('Failed to load bus schedules', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const days = ['ALL', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const filteredSchedules = schedules.filter(
    s => selectedDay === 'ALL' || s.dayOfWeek?.toUpperCase() === selectedDay
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Shuttle & Transit</h1>
        <p className="text-surface-muted text-sm mt-1">
          Safe campus and city transit schedules managed directly for Sakhi residents.
        </p>
      </div>

      {/* Featured Tuesday Shuttle Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-wine-900 via-wine-800 to-rose-700 text-white p-6 sm:p-8 shadow-xl shadow-wine-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-rose-100">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Weekly Official Route</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Tuesday Market & Metro Station Shuttle
            </h2>
            <p className="text-rose-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Every Tuesday afternoon, dedicated Sakhi hostel buses connect residents to the Central Metro station, main shopping square, and university library. Security guard accompanies all return trips.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">Departure Window</span>
            <span className="text-xl font-black text-white block mt-1">4:30 PM & 5:15 PM</span>
            <span className="text-[11px] text-rose-200 block mt-1">Gate 1 • Free for all residents</span>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDay === day 
                  ? 'bg-wine-900 text-white shadow-sm' 
                  : 'bg-surface text-surface-muted hover:text-surface-charcoal hover:bg-wine-50'
              }`}
            >
              {day}
              {day === 'TUESDAY' && ' 🚌'}
            </button>
          ))}
        </div>
      </Card>

      {/* Schedule Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState 
          icon={Bus}
          title="No shuttles scheduled"
          description={`There are no bus runs scheduled for ${selectedDay}.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <BusCard 
              key={schedule.id}
              schedule={schedule}
              isWarden={false}
            />
          ))}
        </div>
      )}

      {/* Driver & Safety Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-wine-50 text-wine-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-charcoal">Transport Supervisor</h3>
              <p className="text-xs text-surface-muted">Hostel Fleet Desk</p>
            </div>
          </div>
          <p className="text-xs text-surface-charcoal">
            For real-time GPS tracking or delay updates, contact Fleet Desk at <span className="font-semibold text-wine-800">+91 98765 11223</span>.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-charcoal">Safety Protocols</h3>
              <p className="text-xs text-surface-muted">Zero compromise on resident security</p>
            </div>
          </div>
          <p className="text-xs text-surface-charcoal">
            All hostel vehicles are equipped with active GPS, speed governors, SOS alarms, and a female security escort for evening transit.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default StudentBus;
