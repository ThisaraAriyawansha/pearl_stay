import React from 'react';
import { Bed, Users, Square } from 'lucide-react';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
  showBookButton?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, showBookButton = true }) => {
  const handleBookClick = () => {
    if (onBook) {
      onBook(room);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-48">
        {room.images && room.images.length > 0 ? (
          <img 
            src={room.images[0]} 
            alt={room.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gradient-to-r from-pearlstay-accent to-pearlstay-neutral h-full flex items-center justify-center">
            <Bed className="h-16 w-16 text-white/70" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-pearlstay-primary">
            ${room.price_per_night}/night
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {room.size && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{room.size}</span>
                </div>
              )}
              {room.bed_type && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{room.bed_type}</span>
                </div>
              )}
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {room.adult_count || 2}</span>
              </div>
            </div>
          </div>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {room.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {room.available_rooms !== undefined ? (
              <span className={room.available_rooms > 0 ? 'text-green-600' : 'text-red-600'}>
                {room.available_rooms > 0 ? `${room.available_rooms} available` : 'Fully booked'}
              </span>
            ) : (
              <span>{room.total_room} rooms total</span>
            )}
          </div>
          
          {showBookButton && (
            <button
              onClick={handleBookClick}
              disabled={room.available_rooms === 0}
              className="bg-pearlstay-primary text-white px-4 py-2 rounded-lg hover:bg-pearlstay-secondary transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {room.available_rooms === 0 ? 'Unavailable' : 'Book Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;