import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Square, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingForm from '../../components/Booking/BookingForm';
import axios from 'axios';

const RoomSingle: React.FC = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(response.data.room);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    alert('Booking successful! You will be redirected to your dashboard.');
    window.location.href = '/dashboard/customer/bookings';
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-300 h-64 md:h-96 rounded-lg"></div>
                <div className="bg-gray-300 h-6 rounded w-3/4"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-300 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="pt-16 min-h-screen bg-background-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Room not found</h2>
          <Link to="/rooms" className="text-primary-600 hover:text-primary-700">
            ← Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 
    ? room.images.map((img: string) => `http://localhost:5000/uploads/${img}`)
    : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="pt-16 min-h-screen bg-background-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/rooms"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Rooms</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Images and Details */}
          <div>
            {/* Image Gallery */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={images[currentImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{room.name}</h1>
                <Link 
                  to={`/hotels/${room.hotel_id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center space-x-1"
                >
                  <span>{room.hotel_name}</span>
                </Link>
                <div className="flex items-center space-x-1 text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{room.hotel_location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg">
                  <Square className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="font-medium text-gray-800">{room.size}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-secondary-50 rounded-lg">
                  <Bed className="h-5 w-5 text-secondary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Bed Type</p>
                    <p className="font-medium text-gray-800">{room.bed_type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-accent-50 rounded-lg">
                  <Users className="h-5 w-5 text-accent-600" />
                  <div>
                    <p className="text-xs text-gray-500">Adult Price</p>
                    <p className="font-medium text-gray-800">${room.adult_price}/night</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-medium text-gray-800">4.5/5</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {room.description || 'Experience comfort and luxury in this beautifully designed room with modern amenities and stunning views.'}
                </p>
              </div>

              {/* Hotel Brief */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About {room.hotel_name}</h3>
                <p className="text-gray-600 mb-4">
                  {room.hotel_description || 'Discover exceptional hospitality and world-class amenities at this premium hotel location.'}
                </p>
                <Link
                  to={`/hotels/${room.hotel_id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  View hotel details →
                </Link>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:sticky lg:top-24">
            <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSingle;