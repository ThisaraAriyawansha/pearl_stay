// imageUtils.js
export const getImageUrl = (imagePath, fallbackUrl) => {
  if (!imagePath) return fallbackUrl;
  
  // Check if it's already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle relative paths from your server
  return `http://localhost:5000/uploads/${imagePath}`;
};

export const handleImageError = (e, fallbackUrl) => {
  e.target.src = fallbackUrl;
};