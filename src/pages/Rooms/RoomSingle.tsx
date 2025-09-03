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
    window.location.href = '/dashboard/customer';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-background-100">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="w-32 h-8 mb-6 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 rounded-lg md:h-96"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="bg-gray-300 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-background-100">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Room not found</h2>
          <Link to="/rooms" className="text-primary-600 hover:text-primary-700">
            ← Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 
    ? room.images.map((img: string) => `http://localhost:5000${img}`)
    : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pt-16 bg-background-100">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/rooms"
          className="inline-flex items-center mb-6 space-x-2 transition-colors text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rooms</span>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Room Images and Details */}
          <div>
            {/* Image Gallery */}
            <div className="relative h-64 mb-6 overflow-hidden rounded-lg md:h-96">
              <img
                src={images[currentImageIndex]}
                alt={room.name}
                className="object-cover w-full h-full"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute p-2 text-white transition-all transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-4 top-1/2 hover:bg-opacity-75"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute p-2 text-white transition-all transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-4 top-1/2 hover:bg-opacity-75"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
                    {images.map((image: string, index: number) => (
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
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="mb-4">
                <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">{room.name}</h1>
                <Link 
                  to={`/hotels/${room.hotel_id}`}
                  className="flex items-center space-x-1 font-medium transition-colors text-primary-600 hover:text-primary-700"
                >
                  <span>{room.hotel_name}</span>
                </Link>
                <div className="flex items-center mt-1 space-x-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{room.hotel_location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
                <div className="flex items-center p-3 space-x-2 rounded-lg bg-primary-50">
                  <Square className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="font-medium text-gray-800">{room.size}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 space-x-2 rounded-lg bg-secondary-50">
                  <Bed className="w-5 h-5 text-secondary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Bed Type</p>
                    <p className="font-medium text-gray-800">{room.bed_type}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 space-x-2 rounded-lg bg-accent-50">
                  <Users className="w-5 h-5 text-accent-600" />
                  <div>
                    <p className="text-xs text-gray-500">Adult Price</p>
                    <p className="font-medium text-gray-800">${room.adult_price}/night</p>
                  </div>
                </div>

                <div className="flex items-center p-3 space-x-2 rounded-lg bg-green-50">
                  <Star className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-medium text-gray-800">4.5/5</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Room Description</h3>
                <p className="leading-relaxed text-gray-600">
                  {room.description || 'Experience comfort and luxury in this beautifully designed room with modern amenities and stunning views.'}
                </p>
              </div>

              {/* Hotel Brief */}
              <div className="pt-6 border-t">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">About {room.hotel_name}</h3>
                <p className="mb-4 text-gray-600">
                  {room.hotel_description || 'Discover exceptional hospitality and world-class amenities at this premium hotel location.'}
                </p>
                <Link
                  to={`/hotels/${room.hotel_id}`}
                  className="font-medium transition-colors text-primary-600 hover:text-primary-700"
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