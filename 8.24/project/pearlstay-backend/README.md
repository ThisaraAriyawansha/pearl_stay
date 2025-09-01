# PearlStay Backend

A Node.js/Express API server for the PearlStay hotel booking system.

## Features

- JWT-based authentication with role-based access control (admin, owner, customer)
- Complete CRUD operations for users, hotels, rooms, and bookings
- Image upload support with multer
- Booking availability checking and price calculation
- SQLite database for development (easily switchable to MySQL for production)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create uploads directory:
```bash
mkdir uploads
```

3. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## Database

For development, the API uses SQLite. For production, switch to MySQL by:

1. Update the database configuration in `config/db.js`
2. Run the MySQL schema from `db.sql`
3. Update the environment variables in `.env`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile (authenticated)

### Users
- GET `/api/users` - List all users (admin only)
- PUT `/api/users/:id` - Update user profile
- PATCH `/api/users/:id/status` - Update user status (admin only)

### Hotels
- POST `/api/hotels` - Create hotel (owner/admin)
- GET `/api/hotels` - List hotels with filters
- GET `/api/hotels/:id` - Get hotel details
- PUT `/api/hotels/:id` - Update hotel
- DELETE `/api/hotels/:id` - Delete hotel (owner/admin)

### Rooms
- POST `/api/rooms` - Create room (owner/admin)
- GET `/api/rooms` - List rooms with filters
- GET `/api/rooms/:id` - Get room details
- PUT `/api/rooms/:id` - Update room
- DELETE `/api/rooms/:id` - Delete room (owner/admin)

### Bookings
- POST `/api/bookings` - Create booking (authenticated)
- GET `/api/bookings` - List bookings (role-based access)
- GET `/api/bookings/:id` - Get booking details
- PATCH `/api/bookings/:id/status` - Update booking status

## Environment Variables

Create a `.env` file with:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=pearlstay
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```