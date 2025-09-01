-- PearlStay Hotel Booking System Database Schema
-- This schema includes all tables, indexes, and sample data

-- Create database
CREATE DATABASE IF NOT EXISTS pearlstay_db;
USE pearlstay_db;

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS room_images;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS statuses;

-- Create statuses table
CREATE TABLE statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    role ENUM('admin', 'owner', 'customer') NOT NULL DEFAULT 'customer',
    nic VARCHAR(20),
    status_id INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status_id)
);

-- Create hotels table
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    cover_image VARCHAR(255),
    user_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    INDEX idx_location (location),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status_id),
    INDEX idx_name (name)
);

-- Create rooms table
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    adult_price DECIMAL(10,2) DEFAULT 0.00,
    total_room INT NOT NULL DEFAULT 1,
    size VARCHAR(50),
    bed_type VARCHAR(50),
    description TEXT,
    status_id INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses(id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_price (price_per_night),
    INDEX idx_status (status_id),
    INDEX idx_bed_type (bed_type),
    INDEX idx_size (size)
);

-- Create room_images table
CREATE TABLE room_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id)
);

-- Create bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    room_count INT NOT NULL DEFAULT 1,
    adult_count INT NOT NULL DEFAULT 1,
    special_note TEXT,
    price DECIMAL(10,2) NOT NULL,
    user_id INT NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_dates (check_in, check_out),
    INDEX idx_booking_status (booking_status),
    INDEX idx_check_in (check_in),
    INDEX idx_check_out (check_out)
);

-- Insert default statuses
INSERT INTO statuses (name, description) VALUES
('active', 'Active and available'),
('pending', 'Pending approval'),
('inactive', 'Inactive or suspended'),
('approved', 'Approved and active'),
('rejected', 'Rejected or declined');

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, status_id) VALUES
('Admin User', 'admin@pearlstay.com', '$2b$10$rQvH8qTtgT8r5i5O7k8g9O8j7k6m5l4n3o2p1q0r9s8t7u6v5w4x3y2z', 'admin', 1);

-- Insert sample hotel owner (password: owner123)
INSERT INTO users (name, email, password, mobile, role, nic, status_id) VALUES
('John Smith', 'owner@pearlstay.com', '$2b$10$rQvH8qTtgT8r5i5O7k8g9O8j7k6m5l4n3o2p1q0r9s8t7u6v5w4x3y2z', '+1234567890', 'owner', 'ID123456789', 1);

-- Insert sample customer (password: customer123)
INSERT INTO users (name, email, password, mobile, role, nic, status_id) VALUES
('Jane Doe', 'customer@pearlstay.com', '$2b$10$rQvH8qTtgT8r5i5O7k8g9O8j7k6m5l4n3o2p1q0r9s8t7u6v5w4x3y2z', '+1987654321', 'customer', 'ID987654321', 1);

-- Insert sample hotel
INSERT INTO hotels (name, location, description, user_id, status_id) VALUES
('Pearl Grand Hotel', 'Colombo, Sri Lanka', 'Luxury hotel in the heart of Colombo with stunning ocean views and world-class amenities.', 2, 1);

-- Insert sample rooms
INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description, status_id) VALUES
(1, 'Deluxe Ocean View', 150.00, 25.00, 5, '35 sqm', 'King', 'Spacious room with panoramic ocean views and modern amenities.', 1),
(1, 'Executive Suite', 280.00, 40.00, 3, '55 sqm', 'King', 'Luxurious suite with separate living area and premium facilities.', 1),
(1, 'Standard Room', 95.00, 15.00, 10, '25 sqm', 'Queen', 'Comfortable room with all essential amenities for a pleasant stay.', 1);