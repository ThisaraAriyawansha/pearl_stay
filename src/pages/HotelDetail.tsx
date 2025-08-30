import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Star, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import RoomCard from '../components/Room/RoomCard';
import BookingForm from '../components/Booking/BookingForm';
import { Hotel, Room } from '../types';
import { useAuth } from '../context/AuthContext';

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`/api/hotels/${id}`);
      if (response.ok) {
        const data = await response.json();
        setHotel(data);
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Failed to fetch hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room: Room) => {
    if (!user) {
      alert('Please login to book a room');
      return;
    }
    if (user.role !== 'customer') {
      alert('Only customers can book rooms');
      return;
    }
    setSelectedRoom(room);
  };

  const handleBookingSubmit = (bookingData: any) => {
    alert('Booking confirmed successfully!');
    setSelectedRoom(null);
    // Refresh room availability
    fetchHotelDetails();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pearlstay-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel not found</h2>
          <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            {hotel.cover_image ? (
              <img 
                src={hotel.cover_image} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-pearlstay-primary to-pearlstay-secondary h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-2">{hotel.name.charAt(0)}</div>
                  <div className="text-xl opacity-80">{hotel.name}</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span className="text-lg">{hotel.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-lg">4.5 (248 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">About This Hotel</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {hotel.description || 'Experience luxury and comfort at this exceptional property. Our hotel offers world-class amenities, outstanding service, and beautifully appointed accommodations designed to make your stay unforgettable.'}
                </p>

                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-600">
                    <Wifi className="h-4 w-4 mr-2" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Car className="h-4 w-4 mr-2" />
                    <span>Free Parking</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Coffee className="h-4 w-4 mr-2" />
                    <span>Room Service</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Utensils className="h-4 w-4 mr-2" />
                    <span>Restaurant</span>
                  </div>
                </div>
              </div>

              <div className="bg-pearlstay-background rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">3:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">11:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-medium">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">English, Spanish</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
          
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onBook={handleBookRoom}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No rooms available for this hotel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onSubmit={handleBookingSubmit}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};

export default HotelDetail;