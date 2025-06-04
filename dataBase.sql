
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

-- loan Types Table (Loan Types)
CREATE TABLE IF NOT EXISTS loan_types (
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
    loan_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    purpose VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (loan_type_id) REFERENCES loan_types(id)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES reservations(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Insert some initial loan types
INSERT INTO loan_types (type, availability, rate, description) VALUES
('Educational', 100, 5.25, 'Loans for tuition, books, and educational supplies'),
('Emergency', 100, 6.00, 'Quick loans for urgent needs'),
('Technology', 50, 4.75, 'Loans for laptops, tablets, and other tech needs'),
('Housing', 75, 5.50, 'Loans for housing deposits and rent');

-- Insert an admin user (password should be hashed in production)
INSERT INTO customers (name, email, phone) VALUES
('Admin User', 'admin@example.com', 'Admin Department');

INSERT INTO users (username, password, email, role, customer_id) VALUES
('admin', 'password123', 'admin@example.com', 'admin', 1);


--Procedure
CREATE OR REPLACE PROCEDURE add_loan(p_student_id IN NUMBER, p_amount IN NUMBER) AS
BEGIN
  INSERT INTO Loans (student_id, amount, loan_date)
  VALUES (p_student_id, p_amount, SYSDATE);
END;


--Procedure + cursor
CREATE OR REPLACE PROCEDURE print_all_loans AS
  CURSOR c_loans IS SELECT loan_id, student_id, amount FROM Loans;
  v_row c_loans%ROWTYPE;
BEGIN
  OPEN c_loans;
  LOOP
    FETCH c_loans INTO v_row;
    EXIT WHEN c_loans%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE('Loan ID: ' || v_row.loan_id || ', Amount: ' || v_row.amount);
  END LOOP;
  CLOSE c_loans;
END;


--Function
CREATE OR REPLACE FUNCTION calculate_interest(p_loan_id IN NUMBER) RETURN NUMBER IS
  v_amount Loans.amount%TYPE;
  v_interest NUMBER;
BEGIN
  SELECT amount INTO v_amount FROM Loans WHERE loan_id = p_loan_id;
  v_interest := v_amount * 0.08; -- 8% interest
  RETURN v_interest;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN 0;
END;

--Trigger
CREATE TRIGGER after_repayment_insert
      AFTER INSERT ON repayments
      FOR EACH ROW
      BEGIN
        INSERT INTO repayment_logs (repayment_id, loan_id, amount, log_message)
        VALUES (
          NEW.id,
          NEW.loan_id,
          NEW.amount,
          CONCAT('Repayment of ', NEW.amount, ' recorded for loan ID ', NEW.loan_id)
        );
      END;
