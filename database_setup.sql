
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS student_loans;
USE student_loans;

-- Customers Table (Students)
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Types Table (Loan Types)
CREATE TABLE IF NOT EXISTS room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    availability INT NOT NULL DEFAULT 100,
    rate DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations Table (Loans)
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    room_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    purpose VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Complaints Table (Repayments)
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    reservation_id INT,
    complaint TEXT NOT NULL,
    amount DECIMAL(10, 2),
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

-- Users table for authentication (Admin and regular users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    customer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE repayments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    complaint VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES reservations(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Insert some initial loan types
INSERT INTO room_types (type, availability, rate, description) VALUES
('Educational', 100, 5.25, 'Loans for tuition, books, and educational supplies'),
('Emergency', 100, 6.00, 'Quick loans for urgent needs'),
('Technology', 50, 4.75, 'Loans for laptops, tablets, and other tech needs'),
('Housing', 75, 5.50, 'Loans for housing deposits and rent');

-- Insert an admin user (password should be hashed in production)
INSERT INTO customers (name, email, phone) VALUES
('Admin User', 'admin@example.com', 'Admin Department');

INSERT INTO users (username, password, email, role, customer_id) VALUES
('admin', 'password123', 'admin@example.com', 'admin', 1);
