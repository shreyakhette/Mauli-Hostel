import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Phone, 
  Users,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { busApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import BusCard from '../../components/bus/BusCard';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const BusManager = () => {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState('TUESDAY');
  const [route, setRoute] = useState('');
  const [departureTime, setDepartureTime] = useState('04:30 PM');
  const [returnTime, setReturnTime] = useState('07:45 PM');
  const [busNumber, setBusNumber] = useState('MH-31-SK-2026');
  const [driverName, setDriverName] = useState('Ramesh Shinde');
  const [driverPhone, setDriverPhone] = useState('+91 98765 11223');
  const [totalSeats, setTotalSeats] = useState(40);

  const days = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday (Weekly Official Run)' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday (Weekend Market Run)' },
    { value: 'SUNDAY', label: 'Sunday' },
  ];

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await busApi.getAllSchedules();
      setSchedules(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load bus schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await busApi.createSchedule({
        dayOfWeek,
        route,
        departureTime,
        returnTime,
        busNumber,
        driverName,
        driverPhone,
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        status: 'ON_TIME'
      });
      showToast('Bus transit schedule added!', 'success');
      setIsCreateModalOpen(false);
      fetchSchedules();
    } catch (err) {
      showToast('Failed to create bus schedule', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Delete this shuttle run schedule?')) return;
    try {
      await busApi.deleteSchedule(id);
      showToast('Bus schedule removed', 'success');
      fetchSchedules();
    } catch (err) {
      showToast('Failed to remove schedule', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Hostel Transit & Bus Fleet</h1>
          <p className="text-surface-muted text-sm mt-1">
            Manage scheduled shuttle trips, Tuesday city transit routes, and assign vetted drivers for student transport.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Schedule Shuttle Run
        </Button>
      </div>

      {/* Grid of Schedules */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : schedules.length === 0 ? (
        <EmptyState
          icon={Bus}
          title="No shuttles active"
          description="Schedule the official Tuesday or weekend transit route for residents."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Add First Shuttle
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <BusCard
              key={schedule.id}
              schedule={schedule}
              isWarden={true}
              onDelete={() => handleDeleteSchedule(schedule.id)}
            />
          ))}
        </div>
      )}

      {/* Create Schedule Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Hostel Bus Trip"
        subtitle="Configure transit stops, timings, and driver details"
      >
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <Select
            label="Day of Week"
            options={days}
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />

          <Input
            label="Route Description"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g. Sakhi Hostel ⇄ University Metro ⇄ Central Mall"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Departure Time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              placeholder="04:30 PM"
              required
            />
            <Input
              label="Return Time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              placeholder="07:45 PM"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bus Reg. Number"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="MH-31-SK-2026"
              required
            />
            <Input
              label="Total Capacity (Seats)"
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Driver Name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Ramesh Shinde"
              required
            />
            <Input
              label="Driver Contact"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="+91 98765 11223"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-divider">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BusManager;
