import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Users, Square, Calendar } from 'lucide-react';

interface Room {
  id: number;
  hotel_id: number;
  name: string;
  price_per_night: number;
  adult_price: number;
  size: string;
  bed_type: string;
  description: string;
  hotel_name: string;
  hotel_location: string;
  images: string[];
}

interface RoomCardProps {
  room: Room;
  className?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, className = '' }) => {
  const imageUrl = room.images && room.images.length > 0 && room.images[0]
    ? `http://localhost:5000${room.images[0]}`
    : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 right-4 bg-primary-600">
          ${room.price_per_night}/night
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="mb-1 text-lg font-semibold text-gray-800">{room.name}</h3>
          <Link 
            to={`/hotels/${room.hotel_id}`}
            className="text-sm font-medium transition-colors text-primary-600 hover:text-primary-700"
          >
            {room.hotel_name}
          </Link>
          <p className="text-xs text-gray-500">{room.hotel_location}</p>
        </div>

        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {room.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Square className="w-4 h-4" />
            <span>{room.size}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span>{room.bed_type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>+${room.adult_price}/adult</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Starting from <span className="text-lg font-semibold text-primary-600">${room.price_per_night}</span>/night
          </div>
          
          <Link
            to={`/rooms/${room.id}`}
            className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;