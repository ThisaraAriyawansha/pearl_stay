import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, ArrowLeft } from 'lucide-react';
import RoomCard from '../../components/Room/RoomCard';
import axios from 'axios';

const HotelSingle: React.FC = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
      setHotel(response.data.hotel);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-64 md:h-96 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-300 h-8 rounded w-3/4"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                <div className="bg-gray-300 h-20 rounded"></div>
              </div>
              <div className="bg-gray-300 h-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-16 min-h-screen bg-background-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hotel not found</h2>
          <Link to="/hotels" className="text-primary-600 hover:text-primary-700">
            ← Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const coverImageUrl = hotel.cover_image 
    ? `http://localhost:5000/uploads/${hotel.cover_image}`
    : 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Utensils, label: 'Restaurant' },
    { icon: Dumbbell, label: 'Fitness Center' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/hotels"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hotels</span>
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={coverImageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{hotel.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Hotel</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {hotel.description || 'Experience luxury and comfort at this exceptional property.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-primary-50 rounded-lg">
                    <amenity.icon className="h-6 w-6 text-primary-600 mb-2" />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Rooms</h2>
              
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room: any) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No rooms available at this hotel</p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hotel Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.5 rating (128 reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{hotel.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Hotel</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📞 +1 (555) 123-4567</p>
                <p>✉️ info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>🌐 www.{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">Need Help?</h3>
              <p className="text-sm text-primary-700 mb-4">
                Our travel experts are here to help you find the perfect room.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSingle;