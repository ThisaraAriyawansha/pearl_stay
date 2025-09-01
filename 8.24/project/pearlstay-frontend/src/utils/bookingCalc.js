// Calculate nights between dates
export function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// Calculate total booking price
export function calculatePrice({ pricePerNight, adultPrice = 0 }, checkIn, checkOut, roomCount = 1, adultCount = 1) {
  const nights = nightsBetween(checkIn, checkOut);
  
  // Base price = nights * pricePerNight * roomCount
  const base = nights * Number(pricePerNight) * Number(roomCount);
  
  // Adult surcharge (for additional adults beyond 1 per room)
  const adultSurcharge = nights * Number(adultPrice) * Math.max(0, adultCount - roomCount);
  
  const total = base + adultSurcharge;
  
  return {
    nights,
    base,
    adultSurcharge,
    total: Math.round(total * 100) / 100 // Round to 2 decimal places
  };
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Validate booking dates
export function validateBookingDates(checkIn, checkOut) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (checkInDate < today) {
    return { valid: false, message: 'Check-in date cannot be in the past' };
  }
  
  if (checkOutDate <= checkInDate) {
    return { valid: false, message: 'Check-out date must be after check-in date' };
  }
  
  return { valid: true };
}