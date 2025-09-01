-- PearlStay: core schema (MySQL)
CREATE DATABASE IF NOT EXISTS pearlstay;
USE pearlstay;

-- statuses table (optional shared status reference)
CREATE TABLE IF NOT EXISTS statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255)
);

INSERT INTO statuses (name, description) VALUES
('active', 'Active'),
('inactive', 'Inactive'),
('pending', 'Pending'),
('approved', 'Approved'),
('rejected', 'Rejected');

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(50),
  role ENUM('admin','owner','customer') NOT NULL DEFAULT 'customer',
  nic VARCHAR(20),
  status_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- hotels
CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  logo VARCHAR(255),
  cover_image VARCHAR(255),
  user_id INT NOT NULL,
  status_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- rooms
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0,
  adult_price DECIMAL(10,2) DEFAULT 0,
  total_room INT DEFAULT 1,
  size VARCHAR(50),
  bed_type VARCHAR(100),
  description TEXT,
  status_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- room_images
CREATE TABLE IF NOT EXISTS room_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_count INT NOT NULL DEFAULT 1,
  adult_count INT DEFAULT 1,
  special_note TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  user_id INT NOT NULL,
  booking_status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- indexes for faster searching
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);
CREATE INDEX idx_bookings_user ON bookings(user_id);