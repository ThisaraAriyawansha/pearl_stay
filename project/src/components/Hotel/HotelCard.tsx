import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Eye } from 'lucide-react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  cover_image?: string;
  status_name?: string;
}

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, className = '' }) => {
  const imageUrl = hotel.cover_image 
    ? `http://localhost:5000/uploads/${hotel.cover_image}`
    : 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <div className="flex items-center space-x-1 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{hotel.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description || 'Discover comfort and luxury at this beautiful property.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5 (128 reviews)</span>
          </div>
          
          <Link
            to={`/hotels/${hotel.id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;