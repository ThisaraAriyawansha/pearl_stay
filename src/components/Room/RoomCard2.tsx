import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RoomCard: React.FC<{ room: any; hotelId: string }> = ({ room, hotelId }) => {
  const [imageError, setImageError] = useState(false);

  const getRoomImageUrl = () => {
    if (imageError || !room.images || room.images.length === 0) {
      return 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=600';
    }
    return `http://localhost:5000/RoomUploads/${room.images[0]}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <img
        src={getRoomImageUrl()}
        alt={room.name}
        className="object-cover w-full h-48 rounded-md"
        onError={() => setImageError(true)}
      />
      <h3 className="mt-4 text-lg font-semibold text-gray-800">{room.name}</h3>
      <p className="text-sm text-gray-600">{room.description || 'Comfortable and spacious room'}</p>
      <div className="mt-2 text-sm text-gray-600">
        <p>Price: ${room.price_per_night}/night</p>
        <p>Size: {room.size || 'N/A'}</p>
        <p>Bed: {room.bed_type || 'N/A'}</p>
        <p>Available Rooms: {room.total_room}</p>
      </div>
      <Link
        to={`/hotels/${hotelId}/rooms/${room.id}/book`}
        className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white rounded-md bg-primary-600 hover:bg-primary-700"
      >
        Book Now
      </Link>
    </div>
  );
};

export default RoomCard;