import { Link } from 'react-router-dom';
import { Bed, Users, Square, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/bookingCalc.js';

export default function RoomCard({ room, showHotelInfo = false }) {
  const mainImage = room.images && room.images.length > 0 
    ? `http://localhost:5000/uploads/${room.images[0]}`
    : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link to={`/rooms/${room.id}`} className="block group">
      <div className="card overflow-hidden animate-slide-up">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
            <span className="text-pearlstay-primary font-semibold">
              {formatCurrency(room.price_per_night)}/night
            </span>
          </div>
          {room.available_rooms !== undefined && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              {room.available_rooms} available
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pearlstay-primary transition-colors">
            {room.name}
          </h3>
          
          {showHotelInfo && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{room.hotel_name} • {room.hotel_location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
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
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Up to {room.total_room * 2} guests</span>
            </div>
          </div>
          
          {room.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {room.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {room.adult_price > 0 && (
                <span>+{formatCurrency(room.adult_price)} per extra adult</span>
              )}
            </div>
            <span className="text-pearlstay-primary font-medium group-hover:text-pearlstay-dark transition-colors">
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}