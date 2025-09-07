import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, ArrowLeft, Users, Bed, Square, Calendar } from 'lucide-react';
import axios from 'axios';
import RoomCard from '../../components/Room/RoomCard';

interface Room {
  id: number;
  name: string;
  price_per_night: string; // Changed to string to match JSON
  adult_price: string; // Changed to string to match JSON
  total_room: number;
  size: string;
  bed_type: string;
  description: string;
  images: string[];
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  cover_image: string;
  logo: string; // Added to match JSON
  rooms: Room[];
}

const HotelSingle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/roomcard/${id}/rooms`);
      setHotel(response.data);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelRooms = async (availabilityCheck = false) => {
    if (!id) return;

    setRoomsLoading(true);
    try {
      let url = `http://localhost:5000/api/roomcard/${id}/rooms`;
      if (availabilityCheck && checkIn && checkOut) {
        url = `http://localhost:5000/api/roomcard/${id}/rooms/available?check_in=${checkIn}&check_out=${checkOut}`;
      }
      const response = await axios.get(url);
      setRooms(response.data.rooms || response.data); // Handle both combined and rooms-only responses
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (checkIn && checkOut) {
      fetchHotelRooms(true);
    } else {
      fetchHotelRooms(false);
    }
  };

  const clearDateFilter = () => {
    setCheckIn('');
    setCheckOut('');
    fetchHotelRooms(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !hotel?.cover_image) {
      return 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920';
    }
    return `http://localhost:5000/uploads/${hotel.cover_image}`;
  };

    const getImageUrlLogo = () => {
    if (imageError || !hotel?.logo) {
      return 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920';
    }
    return `http://localhost:5000/uploads/${hotel.logo}`;
  };

  const getRoomImageUrl = (roomImages: string[]) => {
    if (roomImages?.length > 0 && roomImages[0]) {
      return `http://localhost:5000${roomImages[0]}`;
    }
    return 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-background-100">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 mb-8 bg-gray-300 rounded-lg md:h-96"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-background-100">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Hotel not found</h2>
          <Link to="/hotels" className="text-primary-600 hover:text-primary-700">
            ← Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Utensils, label: 'Restaurant' },
    { icon: Dumbbell, label: 'Fitness Center' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-background-100">
      <div className="px-4 py-8 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/hotels"
          className="inline-flex items-center mb-6 space-x-2 transition-colors text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hotels</span>
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 mb-8 overflow-hidden rounded-lg md:h-96">
          <img
            src={getImageUrl()}
            alt={hotel.name}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />


          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute text-white bottom-6 left-6">
            <h1 className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">{hotel.name}</h1>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{hotel.location}</span>
            </div>
          </div>
        </div>


                    <img
            src={getImageUrlLogo()}
            alt={hotel.name}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Hotel Details */}
          <div className="lg:col-span-2">
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">About This Hotel</h2>
              <p className="mb-6 leading-relaxed text-gray-600">
                {hotel.description || 'Experience luxury and comfort at this exceptional property.'}
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-primary-50">
                    <amenity.icon className="w-6 h-6 mb-2 text-primary-600" />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Section */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-2xl font-semibold text-gray-800">Available Rooms</h2>
              
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {rooms.map((room: any) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-600">No rooms available at this hotel</p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Hotel Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.5 rating (128 reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{hotel.location}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Contact Hotel</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📞 +1 (555) 123-4567</p>
                <p>✉️ info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>🌐 www.{hotel.name.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-primary-50">
              <h3 className="mb-3 text-lg font-semibold text-primary-800">Need Help?</h3>
              <p className="mb-4 text-sm text-primary-700">
                Our travel experts are here to help you find the perfect room.
              </p>
              <Link
                to="/contact"
                className="inline-block px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
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