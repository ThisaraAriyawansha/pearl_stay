export interface User {
  id: number;
  email: string;
  role: 'admin' | 'owner' | 'customer';
  mobile?: string;
  nic?: string;
  status_id: number;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  user_id: number;
  status_id: number;
  owner_email?: string;
  total_rooms?: number;
  min_price?: number;
  created_at: string;
}

export interface Room {
  id: number;
  hotel_id: number;
  name: string;
  price_per_night: number;
  adult_price: number;
  total_room: number;
  size?: string;
  bed_type?: string;
  description?: string;
  status_id: number;
  images: string[];
  available_rooms?: number;
}

export interface Booking {
  id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  room_count: number;
  adult_count: number;
  special_note?: string;
  price: number;
  user_id: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled';
  room_name?: string;
  hotel_name?: string;
  location?: string;
  customer_email?: string;
  created_at: string;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  bedType?: string;
  size?: string;
}

export interface PriceCalculation {
  nights: number;
  roomPrice: number;
  adultPrice: number;
  totalPrice: number;
  breakdown: {
    pricePerNight: number;
    adultPrice: number;
    nights: number;
    roomCount: number;
    adultCount: number;
  };
}