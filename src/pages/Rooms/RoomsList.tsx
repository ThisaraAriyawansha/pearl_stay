import React, { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, Square, Bed } from 'lucide-react';
import RoomCard from '../../components/Room/RoomCard';
import axios from 'axios';
import { motion, AnimatePresence, easeOut } from 'framer-motion';

const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    price_min: '',
    price_max: '',
    size: '',
    bed_type: ''
  });

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      location: urlParams.get('location') || '',
      price_min: urlParams.get('price_min') || '',
      price_max: urlParams.get('price_max') || '',
      size: urlParams.get('size') || '',
      bed_type: urlParams.get('bed_type') || ''
    };
    
    setFilters(initialFilters);
    fetchRooms(initialFilters);
  }, []);

  const fetchRooms = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {} as any);

      const response = await axios.get('http://localhost:5000/api/rooms', { params });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchRooms();
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      price_min: '',
      price_max: '',
      size: '',
      bed_type: ''
    };
    setFilters(clearedFilters);
    fetchRooms(clearedFilters);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'];
  const sizes = ['Small', 'Medium', 'Large', 'Suite'];


      const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      // This code runs only on the client side
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      // Set initial value
      handleResize();
  
      // Add event listener
      window.addEventListener("resize", handleResize);
  
      // Clean up
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/image/2024-10-08T06_56_55.422Z.jpg')",
          // Responsive background sizing
          backgroundSize: "cover",
          // Responsive positioning - focus on center for mobile, allow more flexibility for desktop
          backgroundPosition: isMobile ? "center 30%" : "center center",
          // Fix background image for desktop only
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-black"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 max-w-4xl px-4 mx-auto"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-2 text-xs tracking-wide uppercase sm:text-sm md:text-base md:mb-3"
          >
            {`Browse through our collection of comfortable and luxurious rooms`}
          </motion.p>

          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.7, duration: 0.8, ease: easeOut }}
            className="h-[1px] bg-gray-300 mx-auto mb-3 md:mb-4 sm:w-24 md:w-32"
          ></motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Find Your Perfect Room
          </motion.h1>
        </motion.div>
      </motion.div>

      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={filterVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="p-6 mb-8 bg-white rounded-lg shadow-md"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Filter Rooms</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-5">
            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Location..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </motion.div>

            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <DollarSign className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="number"
                value={filters.price_min}
                onChange={(e) => handleFilterChange('price_min', e.target.value)}
                placeholder="Min price..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </motion.div>

            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <DollarSign className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="number"
                value={filters.price_max}
                onChange={(e) => handleFilterChange('price_max', e.target.value)}
                placeholder="Max price..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </motion.div>

            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <Square className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </motion.div>

            <motion.div 
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <Bed className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <select
                value={filters.bed_type}
                onChange={(e) => handleFilterChange('bed_type', e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All bed types</option>
                {bedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </motion.div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={applyFilters}
              className="flex items-center px-6 py-2 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
            >
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Clear All
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-md h-96 animate-pulse"
              >
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : rooms.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600">
                Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {rooms.map((room: any) => (
                  <motion.div
                    key={room.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <RoomCard room={room} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-12 text-center"
          >
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No rooms found</h3>
              <p className="mb-4 text-gray-600">Try adjusting your filter criteria</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomsList;