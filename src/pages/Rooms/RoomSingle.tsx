import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Square, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from '../../components/Booking/BookingForm';
import axios from 'axios';

const RoomSingle: React.FC = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

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
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      window.location.href = '/dashboard/customer';
    }, 2000);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen pt-16 bg-[#e3e3e9]"
      >
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="w-32 h-8 mb-6 bg-[#c7c7d4] rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="h-64 bg-[#c7c7d4] rounded-lg md:h-96"></div>
                <div className="w-3/4 h-6 bg-[#c7c7d4] rounded"></div>
                <div className="w-1/2 h-4 bg-[#c7c7d4] rounded"></div>
              </div>
              <div className="bg-[#c7c7d4] rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!room) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen pt-16 bg-[#e3e3e9]"
      >
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#747293]">Room not found</h2>
          <Link to="/rooms" className="text-[#908ea9] hover:text-[#acaabe]">
            ← Back to Rooms
          </Link>
        </div>
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-16 bg-[#e3e3e9]"
    >
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/rooms"
            className="inline-flex items-center mb-6 space-x-2 transition-colors text-[#908ea9] hover:text-[#acaabe]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rooms</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Room Images and Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Image Gallery */}
            <div className="relative h-64 mb-6 overflow-hidden rounded-lg md:h-96">
              <AnimatePresence>
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={room.name}
                  className="object-cover w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute p-2 text-white transition-all transform -translate-y-1/2 bg-[#747293] bg-opacity-50 rounded-full left-4 top-1/2 hover:bg-opacity-75"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute p-2 text-white transition-all transform -translate-y-1/2 bg-[#747293] bg-opacity-50 rounded-full right-4 top-1/2 hover:bg-opacity-75"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
                    {images.map((image: string, index: number) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-[#acaabe]' : 'bg-[#c7c7d4]'
                        }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Room Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-white rounded-lg shadow-md"
            >
              <div className="mb-4">
                <h1 className="mb-2 text-2xl font-bold text-[#747293] md:text-3xl">{room.name}</h1>
                <Link 
                  to={`/hotels/${room.hotel_id}`}
                  className="flex items-center space-x-1 font-medium transition-colors text-[#908ea9] hover:text-[#acaabe]"
                >
                  <span>{room.hotel_name}</span>
                </Link>
                <div className="flex items-center mt-1 space-x-1 text-[#c7c7d4]">
                  <MapPin className="w-4 h-4" />
                  <span>{room.hotel_location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center p-3 space-x-2 rounded-lg bg-[#e3e3e9]"
                >
                  <Square className="w-5 h-5 text-[#908ea9]" />
                  <div>
                    <p className="text-xs text-[#c7c7d4]">Size</p>
                    <p className="font-medium text-[#747293]">{room.size}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center p-3 space-x-2 rounded-lg bg-[#e3e3e9]"
                >
                  <Bed className="w-5 h-5 text-[#908ea9]" />
                  <div>
                    <p className="text-xs text-[#c7c7d4]">Bed Type</p>
                    <p className="font-medium text-[#747293]">{room.bed_type}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-center p-3 space-x-2 rounded-lg bg-[#e3e3e9]"
                >
                  <Users className="w-5 h-5 text-[#908ea9]" />
                  <div>
                    <p className="text-xs text-[#c7c7d4]">Adult Price</p>
                    <p className="font-medium text-[#747293]">${room.adult_price}/night</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex items-center p-3 space-x-2 rounded-lg bg-[#e3e3e9]"
                >
                  <Star className="w-5 h-5 text-[#908ea9]" />
                  <div>
                    <p className="text-xs text-[#c7c7d4]">Rating</p>
                    <p className="font-medium text-[#747293]">4.5/5</p>
                  </div>
                </motion.div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-[#747293]">Room Description</h3>
                <p className="leading-relaxed text-[#c7c7d4]">
                  {room.description || 'Experience comfort and luxury in this beautifully designed room with modern amenities and stunning views.'}
                </p>
              </div>

              {/* Hotel Brief */}
              <div className="pt-6 border-t border-[#c7c7d4]">
                <h3 className="mb-3 text-lg font-semibold text-[#747293]">About {room.hotel_name}</h3>
                <p className="mb-4 text-[#c7c7d4]">
                  {room.hotel_description || 'Discover exceptional hospitality and world-class amenities at this premium hotel location.'}
                </p>
                <Link
                  to={`/hotels/${room.hotel_id}`}
                  className="font-medium transition-colors text-[#908ea9] hover:text-[#acaabe]"
                >
                  View hotel details →
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:sticky lg:top-24"
          >
            <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
          </motion.div>
        </div>

        {/* Custom Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-40 right-4 bg-[#747293] text-white px-6 py-3 rounded-lg shadow-lg text-sm"
            >
              Booking successful! Redirecting to dashboard...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RoomSingle;