import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  BedDouble, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Layers, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { roomApi } from '../../api/services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RoomCard from '../../components/room/RoomCard';
import VisualBedLayout from '../../components/room/VisualBedLayout';
import BedAssignModal from '../../components/room/BedAssignModal';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

export const RoomManagement = () => {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchRoom, setSearchRoom] = useState('');

  // Selected Room for Blueprint View
  const [activeRoom, setActiveRoom] = useState(null);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);

  // Bed Assign Modal State
  const [selectedBedForAssign, setSelectedBedForAssign] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomApi.getAll();
      setRooms(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load hostel rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenRoomBlueprint = async (room) => {
    try {
      // Fetch full room data with beds
      const fullRoom = await roomApi.getById(room.id);
      setActiveRoom(fullRoom);
      setBlueprintModalOpen(true);
    } catch (err) {
      showToast('Could not load room layout', 'error');
    }
  };

  const handleAssignBedClick = (bed) => {
    setSelectedBedForAssign(bed);
    setIsAssignModalOpen(true);
  };

  const handleConfirmBedAssign = async (bedId, studentId) => {
    try {
      await roomApi.assignBed({ bedId, studentId });
      showToast('Student successfully allocated to bed!', 'success');
      // Refresh room layout
      if (activeRoom) {
        const updated = await roomApi.getById(activeRoom.id);
        setActiveRoom(updated);
      }
      fetchRooms();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign bed', 'error');
      throw err;
    }
  };

  const handleUnassignBed = async (bedId) => {
    if (!window.confirm('Are you sure you want to unassign this resident and vacate this bed?')) return;
    try {
      await roomApi.unassignBed(bedId);
      showToast('Bed has been vacated and marked Available.', 'success');
      if (activeRoom) {
        const updated = await roomApi.getById(activeRoom.id);
        setActiveRoom(updated);
      }
      fetchRooms();
    } catch (err) {
      showToast('Failed to unassign bed', 'error');
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesFloor = selectedFloor === 'ALL' || r.floor === Number(selectedFloor);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch = searchRoom === '' || r.roomNumber.toLowerCase().includes(searchRoom.toLowerCase());
    return matchesFloor && matchesStatus && matchesSearch;
  });

  const floors = ['ALL', '1', '2', '3', '4', '5'];
  const statuses = ['ALL', 'AVAILABLE', 'PARTIAL', 'FULL'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-surface-charcoal">Room & Bed Allocations</h1>
          <p className="text-surface-muted text-sm mt-1">
            Browse 100 rooms across 5 floors. Inspect 4-bed interactive blueprints, assign students, and manage capacity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-wine-50 text-wine-900 border border-wine-200">
            Total: {rooms.length} Rooms ({rooms.length * 4} Beds)
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Room Number Search */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search room (e.g. 203)..."
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-divider focus:outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600"
            />
          </div>

          {/* Floor Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-surface-muted uppercase mr-1">Floor:</span>
            {floors.map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFloor === fl 
                    ? 'bg-wine-900 text-white shadow-sm' 
                    : 'bg-surface text-surface-muted hover:text-surface-charcoal hover:bg-wine-50'
                }`}
              >
                {fl === 'ALL' ? 'All Floors' : `Floor ${fl}`}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-surface-muted uppercase mr-1">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st 
                    ? 'bg-wine-900 text-white shadow-sm' 
                    : 'bg-surface text-surface-muted hover:text-surface-charcoal hover:bg-wine-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Room Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <EmptyState 
          icon={Building2}
          title="No rooms match filters"
          description="Try selecting a different floor or changing the occupancy status filter."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard 
              key={room.id}
              room={room}
              onViewRoom={() => handleOpenRoomBlueprint(room)}
            />
          ))}
        </div>
      )}

      {/* Blueprint Modal */}
      <Modal
        isOpen={blueprintModalOpen}
        onClose={() => setBlueprintModalOpen(false)}
        size="lg"
      >
        {activeRoom && (
          <div className="space-y-6">
            <VisualBedLayout
              room={activeRoom}
              isWarden={true}
              onAssignBed={handleAssignBedClick}
              onUnassignBed={handleUnassignBed}
            />

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setBlueprintModalOpen(false)}>
                Close Blueprint
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bed Assignment Modal */}
      <BedAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        bed={selectedBedForAssign}
        onAssigned={handleConfirmBedAssign}
      />
    </div>
  );
};

export default RoomManagement;
