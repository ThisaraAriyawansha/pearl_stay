import { Link } from 'react-router-dom';
import { MapPin, Star, Bed } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const coverImage = hotel.cover_image 
    ? `http://localhost:5000/uploads/${hotel.cover_image}`
    : 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link to={`/hotels/${hotel.id}`} className="block group">
      <div className="card overflow-hidden animate-fade-in">
        <div className="relative h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-pearlstay-primary">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current" />
              <span>4.5</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pearlstay-primary transition-colors">
            {hotel.name}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{hotel.location}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {hotel.description || 'Experience luxury and comfort at this beautiful hotel.'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-pearlstay-secondary">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{hotel.room_count} rooms available</span>
            </div>
            <span className="text-pearlstay-primary font-medium">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}