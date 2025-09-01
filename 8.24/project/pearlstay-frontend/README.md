# PearlStay Frontend

A React/Tailwind CSS frontend for the PearlStay hotel booking system.

## Features

- Modern, responsive design with custom PearlStay color palette
- User authentication and role-based navigation
- Hotel and room browsing with advanced filtering
- Real-time booking price calculation
- Mobile-first responsive design
- Smooth animations and micro-interactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will run on http://localhost:5173

## Project Structure

```
src/
├─ api/           # API integration modules
├─ components/    # Reusable UI components
├─ pages/         # Page components
├─ utils/         # Utility functions
├─ App.jsx        # Main app component
└─ main.jsx       # Entry point
```

## Color Palette

The app uses a custom PearlStay color palette:

- Primary: #747293
- Secondary: #908ea9  
- Accent: #acaabe
- Neutral: #c7c7d4
- Background: #e3e3e9
- Dark: #5a5a7a

## User Roles

- **Customer**: Browse hotels, make bookings, view booking history
- **Owner**: Manage hotels and rooms, view hotel bookings
- **Admin**: Full system access, user management, hotel approval

## Key Components

- `SearchBar`: Advanced search with date and guest selection
- `HotelCard`: Display hotel information with images
- `RoomCard`: Show room details with pricing
- `BookingForm`: Handle booking creation with price calculation
- `PrivateRoute`: Role-based route protection

## API Integration

The frontend communicates with the backend API through axios with automatic token management and error handling.