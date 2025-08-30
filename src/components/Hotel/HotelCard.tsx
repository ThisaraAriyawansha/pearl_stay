import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { Hotel } from '../../types';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-r from-pearlstay-primary to-pearlstay-secondary">
        {hotel.cover_image ? (
          <img 
            src={hotel.cover_image} 
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Hotel className="h-16 w-16 text-white/70" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>
          {hotel.logo && (
            <img 
              src={hotel.logo} 
              alt={`${hotel.name} logo`}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description || 'Experience luxury and comfort at this beautiful property.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{hotel.total_rooms || 0} rooms</span>
            </div>
            {hotel.min_price && (
              <div className="font-semibold text-pearlstay-primary">
                From ${hotel.min_price}/night
              </div>
            )}
          </div>
          
          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-pearlstay-primary text-white px-4 py-2 rounded-lg hover:bg-pearlstay-secondary transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;