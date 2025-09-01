# PearlStay Hotel Booking System

A comprehensive full-stack hotel booking system built with React.js, Node.js, Express, and MySQL.

## Features

### User Roles
- **Admin**: Manage users, hotels, rooms, and bookings
- **Hotel Owner**: CRUD operations for hotels and rooms, view bookings
- **Customer**: Search hotels, book rooms, manage bookings

### Core Functionality
- JWT-based authentication with role-based access control
- Advanced search and filtering for hotels and rooms
- Real-time availability checking with date overlap logic
- Automated booking price calculations
- Image upload system for room photos
- Responsive design with custom PearlStay color palette

## Tech Stack

### Frontend
- React.js 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL with mysql2
- JWT Authentication
- bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## Getting Started

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pearlstay-hotel-booking
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Setup Database**
   - Create a MySQL database named `pearlstay_db`
   - Import the schema from `server/schema.sql`
   - Copy `server/.env.example` to `server/.env`
   - Update the database credentials in `.env`

4. **Setup Frontend**
   ```bash
   # From root directory
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   # From root directory
   npm run client
   ```
   Frontend runs on http://localhost:5173

3. **Run Both Simultaneously**
   ```bash
   # From root directory
   npm run dev
   ```

## Database Schema

### Tables
- `users` - User accounts with roles (admin, owner, customer)
- `hotels` - Hotel properties managed by owners
- `rooms` - Individual rooms within hotels
- `room_images` - Multiple images per room
- `bookings` - Customer reservations
- `statuses` - Status lookup table

### Default Users
- **Admin**: admin@pearlstay.com / admin123
- **Owner**: owner@pearlstay.com / owner123  
- **Customer**: customer@pearlstay.com / customer123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Hotels
- `GET /api/hotels` - Get all hotels (with filters)
- `GET /api/hotels/:id` - Get hotel by ID
- `GET /api/hotels/owner` - Get owner's hotels
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/:id` - Update hotel
- `PUT /api/hotels/:id/status` - Update hotel status
- `DELETE /api/hotels/:id` - Delete hotel

### Rooms
- `GET /api/rooms` - Get all rooms (with filters)
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/hotel/:hotel_id` - Get hotel's rooms
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `PUT /api/rooms/:id/status` - Update room status
- `DELETE /api/rooms/:id` - Delete room

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/me` - Get user's bookings
- `GET /api/bookings/hotel/:hotel_id` - Get hotel's bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/calculate-price` - Calculate booking price

## Color Palette

```css
primary: #747293
secondary: #908ea9
accent: #acaabe
neutral: #c7c7d4
background: #e3e3e9
```

## Features Overview

### Customer Features
- Browse and search hotels
- Filter rooms by price, size, bed type
- Real-time availability checking
- Automated price calculations
- Secure booking process
- Booking management dashboard

### Owner Features  
- Hotel and room management
- Image upload for properties
- Booking analytics and management
- Profile management

### Admin Features
- User management (activate/deactivate)
- Hotel approval system
- System-wide booking oversight
- Comprehensive analytics

## Project Structure

```
pearlstay-hotel-booking/
├── src/                          # Frontend React application
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   ├── contexts/                # React contexts
│   └── utils/                   # Utility functions
├── server/                      # Backend Node.js application
│   ├── controllers/             # Route controllers
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── config/                  # Configuration files
│   └── uploads/                 # File upload directory
└── README.md
```

## License

MIT License - feel free to use this project for learning and development purposes.