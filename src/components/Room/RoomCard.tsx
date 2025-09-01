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
    ? `http://localhost:5000/uploads/${room.images[0]}`
    : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${room.price_per_night}/night
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.name}</h3>
          <Link 
            to={`/hotels/${room.hotel_id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            {room.hotel_name}
          </Link>
          <p className="text-gray-500 text-xs">{room.hotel_location}</p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Square className="h-4 w-4" />
            <span>{room.size}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span>{room.bed_type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>+${room.adult_price}/adult</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Starting from <span className="text-lg font-semibold text-primary-600">${room.price_per_night}</span>/night
          </div>
          
          <Link
            to={`/rooms/${room.id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;