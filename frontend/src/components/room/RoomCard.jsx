import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { BedDouble, Eye } from 'lucide-react';

export const RoomCard = ({ room, onViewRoom }) => {
  const capacity = room.capacity || 4;
  const occupied = room.occupiedCount || 0;

  // Generate occupancy indicator dots ● ● ● ○
  const dots = [];
  for (let i = 0; i < capacity; i++) {
    const isFilled = i < occupied;
    dots.push(
      <span
        key={i}
        className={`w-2.5 h-2.5 rounded-full transition-all ${
          isFilled ? 'bg-wine-800' : 'bg-gray-200'
        }`}
        title={`Bed ${i + 1}: ${isFilled ? 'Occupied' : 'Available'}`}
      />
    );
  }

  const getBorderColor = () => {
    switch (room.status) {
      case 'FULL': return 'border-rose-100 hover:border-rose-200';
      case 'PARTIAL': return 'border-amber-100 hover:border-amber-200';
      case 'AVAILABLE': return 'border-emerald-100 hover:border-emerald-200';
      default: return 'border-gray-100 hover:border-gray-200';
    }
  };

  return (
    <Card hover className={`p-5 flex flex-col justify-between ${getBorderColor()}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-wine-50 text-wine-900 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 leading-tight">
                ROOM {room.roomNumber}
              </h4>
              <p className="text-xs text-gray-500 font-medium">Floor {room.floor}</p>
            </div>
          </div>
          <Badge status={room.status} />
        </div>

        {/* Occupancy dots and count */}
        <div className="my-4 p-3 rounded-xl bg-surface-50 border border-gray-100/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">{dots}</div>
          <span className="text-xs font-bold text-gray-700">
            {occupied} / {capacity} occupied
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-2"
        icon={Eye}
        onClick={() => onViewRoom(room)}
      >
        View Room
      </Button>
    </Card>
  );
};

export default RoomCard;
