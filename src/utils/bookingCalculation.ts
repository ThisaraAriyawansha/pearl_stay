// PearlStay Booking Price Calculation Utility

export interface BookingCalculationParams {
  pricePerNight: number;
  adultPrice: number;
  checkIn: string;
  checkOut: string;
  roomCount: number;
  adultCount: number;
}

export interface BookingCalculationResult {
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

/**
 * Calculate the total booking price based on room details and booking parameters
 * 
 * Formula:
 * - Room Cost = price_per_night × room_count × nights
 * - Adult Cost = adult_price × adult_count × nights
 * - Total = Room Cost + Adult Cost
 */
export const calculateBookingPrice = (params: BookingCalculationParams): BookingCalculationResult => {
  const {
    pricePerNight,
    adultPrice,
    checkIn,
    checkOut,
    roomCount,
    adultCount
  } = params;

  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Calculate costs
  const roomPrice = pricePerNight * roomCount * nights;
  const totalAdultPrice = adultPrice * adultCount * nights;
  const totalPrice = roomPrice + totalAdultPrice;

  return {
    nights,
    roomPrice,
    adultPrice: totalAdultPrice,
    totalPrice,
    breakdown: {
      pricePerNight,
      adultPrice,
      nights,
      roomCount,
      adultCount
    }
  };
};

/**
 * Check if booking dates are valid
 */
export const validateBookingDates = (checkIn: string, checkOut: string): boolean => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if check-in is not in the past
  if (checkInDate < today) {
    return false;
  }

  // Check if check-out is after check-in
  if (checkOutDate <= checkInDate) {
    return false;
  }

  return true;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Calculate booking summary for display
 */
export const getBookingSummary = (params: BookingCalculationParams) => {
  const calculation = calculateBookingPrice(params);
  
  return {
    ...calculation,
    formattedPrices: {
      roomPrice: formatPrice(calculation.roomPrice),
      adultPrice: formatPrice(calculation.adultPrice),
      totalPrice: formatPrice(calculation.totalPrice),
      pricePerNight: formatPrice(params.pricePerNight)
    },
    dateRange: `${new Date(params.checkIn).toLocaleDateString()} - ${new Date(params.checkOut).toLocaleDateString()}`
  };
};