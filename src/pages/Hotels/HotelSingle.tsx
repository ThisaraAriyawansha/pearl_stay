import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, ArrowLeft, Users, Bed, Square, Calendar } from 'lucide-react';
import axios from 'axios';
import RoomCard from '../../components/Room/RoomCard';

interface Room {
  id: number;
  name: string;
  price_per_night: string;
  adult_price: string;
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
  logo: string;
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
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Stagger animation stages
      const stages = [1, 2, 3, 4];
      stages.forEach((stage, index) => {
        setTimeout(() => setAnimationStage(stage), index * 200);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
      setRooms(response.data.rooms || response.data);
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
            <div className="h-64 mb-8 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 md:h-96 animate-shimmer bg-size-200"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="w-3/4 h-8 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
                <div className="w-1/2 h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
                <div className="h-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
              </div>
              <div className="h-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-background-100">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Hotel not found</h2>
          <Link 
            to="/hotels" 
            className="inline-flex items-center space-x-2 transition-all duration-300 text-primary-600 hover:text-primary-700 hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300" />
            <span>Back to Hotels</span>
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
      <div className="px-4 py-8 mx-auto mt-2 max-w-7xl sm:px-6 lg:px-8">
        {/* Back button with entrance animation */}
        <div className={`transform transition-all duration-700 ${animationStage >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <Link
            to="/hotels"
            className="inline-flex items-center mb-6 space-x-2 transition-all duration-300 text-primary-600 hover:text-primary-700 hover:translate-x-1 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Hotels</span>
          </Link>
        </div>

        {/* Hero Image with dramatic entrance */}
        <div className={`relative mb-8 overflow-hidden rounded-xl transform transition-all duration-1000 ${animationStage >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="relative overflow-hidden group">
            <img
              src={getImageUrl()}
              alt={hotel.name}
              className="w-full h-[34rem] object-cover transition-transform duration-700 group-hover:scale-105"
              onError={handleImageError}
            />
            <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/50" />
            
            {/* Hotel info overlay with staggered animation */}
            <div className={`absolute flex items-end space-x-4 bottom-8 left-8 transform transition-all duration-1000 delay-300 ${animationStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative">
                <img
                  src={getImageUrlLogo()}
                  alt={`${hotel.name} logo`}
                  className="object-cover w-16 h-16 transition-transform duration-300 border-2 border-white rounded-full hover:scale-110 hover:shadow-lg"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 transition-all duration-300 rounded-full ring-0 ring-white/30 hover:ring-4"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-white transition-all duration-300 hover:text-yellow-100">
                  {hotel.name}
                </h1>
                <div className="flex items-center space-x-2 transition-colors duration-300 text-white/90 hover:text-white">
                  <MapPin className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
                  <span>{hotel.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Hotel Details with cascading animation */}
          <div className="lg:col-span-2">
            <div className={`p-6 mb-8 bg-white rounded-lg shadow-md transform transition-all duration-800 delay-200 hover:shadow-xl hover:-translate-y-1 ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800 transition-colors duration-300 hover:text-primary-600">
                About This Hotel
              </h2>
              <p className="mb-6 leading-relaxed text-gray-600 transition-colors duration-300 hover:text-gray-700">
                {hotel.description || 'Experience luxury and comfort at this exceptional property.'}
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center p-3 rounded-lg bg-primary-50 transform transition-all duration-500 hover:bg-primary-100 hover:scale-105 hover:shadow-md cursor-pointer group ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <amenity.icon className="w-6 h-6 mb-2 transition-all duration-300 text-primary-600 group-hover:scale-110 group-hover:text-primary-700" />
                    <span className="text-sm text-gray-700 transition-colors duration-300 group-hover:text-gray-800 group-hover:font-medium">
                      {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Section with loading animation */}
            <div className={`p-6 bg-white rounded-lg shadow-md transform transition-all duration-1000 delay-400 hover:shadow-xl ${animationStage >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h2 className="mb-6 text-2xl font-semibold text-gray-800 transition-colors duration-300 hover:text-primary-600">
                Available Rooms
              </h2>
              
              {roomsLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-48 mb-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
                        <div className="w-3/4 h-4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-size-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {rooms.map((room: any, index) => (
                    <div
                      key={room.id}
                      className={`transform transition-all duration-700 hover:scale-105 ${animationStage >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                      style={{ transitionDelay: `${600 + index * 150}ms` }}
                    >
                      <RoomCard room={room} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className={`transform transition-all duration-700 ${animationStage >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-gray-600">No rooms available at this hotel</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Info Sidebar with staggered cards */}
          <div className="space-y-6">
            <div className={`p-6 bg-white rounded-lg shadow-md transform transition-all duration-800 delay-300 hover:shadow-xl hover:-translate-y-1 ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h3 className="mb-4 text-lg font-semibold text-gray-800 transition-colors duration-300 hover:text-primary-600">
                Hotel Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 transition-all duration-300 cursor-pointer hover:translate-x-1 group">
                  <Star className="w-4 h-4 text-yellow-400 transition-transform duration-300 fill-current group-hover:scale-110" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">4.5 rating (128 reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2 transition-all duration-300 cursor-pointer hover:translate-x-1 group">
                  <MapPin className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-primary-500 group-hover:scale-110" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800">{hotel.location}</span>
                </div>
              </div>
            </div>

            <div className={`p-6 bg-white rounded-lg shadow-md transform transition-all duration-800 delay-500 hover:shadow-xl hover:-translate-y-1 ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h3 className="mb-4 text-lg font-semibold text-gray-800 transition-colors duration-300 hover:text-primary-600">
                Contact Hotel
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="transition-all duration-300 cursor-pointer hover:text-gray-800 hover:translate-x-1">
                  📞 +94 (765) 123-123
                </p>
                <p className="transition-all duration-300 cursor-pointer hover:text-gray-800 hover:translate-x-1">
                  ✉️ info@{hotel.name.toLowerCase().replace(/\s+/g, '')}.com
                </p>
                <p className="transition-all duration-300 cursor-pointer hover:text-gray-800 hover:translate-x-1">
                  🌐 www.{hotel.name.toLowerCase().replace(/\s+/g, '')}.com
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-lg bg-primary-50 transform transition-all duration-800 delay-700 hover:shadow-lg hover:-translate-y-1 hover:bg-primary-100 ${animationStage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h3 className="mb-3 text-lg font-semibold transition-colors duration-300 text-primary-800 hover:text-primary-900">
                Need Help?
              </h3>
              <p className="mb-4 text-sm transition-colors duration-300 text-primary-700 hover:text-primary-800">
                Our travel experts are here to help you find the perfect room.
              </p>
              <Link
                to="/contact"
                className="inline-block px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform rounded-md bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-95"
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