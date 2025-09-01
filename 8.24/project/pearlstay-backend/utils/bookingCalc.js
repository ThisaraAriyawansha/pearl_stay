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
    total
  };
}