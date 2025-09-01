-- PearlStay: SQLite schema for development
PRAGMA foreign_keys = ON;

-- statuses table
CREATE TABLE IF NOT EXISTS statuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

INSERT OR IGNORE INTO statuses (name, description) VALUES
('active', 'Active'),
('inactive', 'Inactive'),
('pending', 'Pending'),
('approved', 'Approved'),
('rejected', 'Rejected');

-- users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('admin','owner','customer')),
  nic VARCHAR(20),
  status_id INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- hotels
CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  logo VARCHAR(255),
  cover_image VARCHAR(255),
  user_id INTEGER NOT NULL,
  status_id INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- rooms
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hotel_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0,
  adult_price DECIMAL(10,2) DEFAULT 0,
  total_room INTEGER DEFAULT 1,
  size VARCHAR(50),
  bed_type VARCHAR(100),
  description TEXT,
  status_id INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- room_images
CREATE TABLE IF NOT EXISTS room_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_count INTEGER NOT NULL DEFAULT 1,
  adult_count INTEGER DEFAULT 1,
  special_note TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK(booking_status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_rooms_price ON rooms(price_per_night);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);

-- Insert sample admin user (password: admin123)
INSERT OR IGNORE INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@pearlstay.com', '$2a$10$rQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7O', 'admin');