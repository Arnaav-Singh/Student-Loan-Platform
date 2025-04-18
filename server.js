import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());
app.use(express.json());

// Database connection
let pool;
async function initializeDatabase() {
  try {
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'Welcome2023',
      database: 'student_loans',
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const [users] = await pool.query('SELECT id, role, customer_id FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = { id: decoded.userId, role: users[0].role, customer_id: users[0].customer_id };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, university } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const [customerResult] = await pool.query(
      'INSERT INTO customers (name, email, phone, university) VALUES (?, ?, ?, ?)',
      [name, email, phone, university || null]
    );
    const customerId = customerResult.insertId;

    const [userResult] = await pool.query(
      'INSERT INTO users (name, email, password, role, customer_id, phone, university) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, 'user', customerId, phone, university || null]
    );

    const token = jwt.sign({ userId: userResult.insertId }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({
      user: {
        id: userResult.insertId,
        name,
        email,
        role: 'user',
        customer_id: customerId,
        phone,
        university,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, password, role, customer_id, phone, university FROM users WHERE email = ?',
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = users[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.customer_id) {
      console.error(`Login failed for email ${email}: missing customer_id`);
      return res.status(500).json({ error: 'User account incomplete: missing customer ID' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        customer_id: user.customer_id,
        phone: user.phone,
        university: user.university,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Fetch Customers (Admin-only)
app.get('/api/customers', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        u.phone,
        u.university,
        u.role,
        u.customer_id
      FROM users u
      LEFT JOIN customers c ON u.customer_id = c.id
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
  }
});

// Room Types
app.get('/api/room_types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, type AS name FROM room_types');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No room types found' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ error: 'Failed to fetch room types', details: error.message });
  }
});

// Create Reservation (Loan Application)
app.post('/api/reservations', verifyToken, async (req, res) => {
  const {
    customer_id,
    room_type_id,
    start_date,
    end_date,
    purpose,
    amount,
    employment_status,
    housing_status,
    terms_agreed,
    other_loans,
    educational_purpose,
  } = req.body;

  if (!customer_id || !room_type_id || !start_date || !end_date || !amount || !terms_agreed) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (req.user.customer_id !== customer_id) {
    return res.status(403).json({ error: 'Unauthorized: customer_id does not match user' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO reservations (
        customer_id, room_type_id, start_date, end_date, purpose, amount, status,
        employment_status, housing_status, terms_agreed, other_loans, educational_purpose
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        room_type_id,
        start_date,
        end_date,
        purpose || null,
        amount,
        'pending',
        employment_status || null,
        housing_status || null,
        terms_agreed,
        other_loans || null,
        educational_purpose || 0,
      ]
    );

    const [reservation] = await pool.query('SELECT * FROM reservations WHERE id = ?', [result.insertId]);
    res.json(reservation[0]);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation', details: error.message });
  }
});

// Admin Dashboard Data
app.get('/api/admin/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const [reservations] = await pool.query(`
      SELECT 
        r.id AS reservation_id,
        r.customer_id,
        r.room_type_id,
        rt.type AS room_type,
        r.start_date,
        r.end_date,
        r.status,
        COALESCE(r.amount, 0) AS amount,
        r.purpose,
        r.complaint,
        r.created_at,
        r.employment_status,
        r.housing_status,
        r.terms_agreed,
        r.other_loans,
        r.educational_purpose,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
      FROM reservations r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN customers c ON r.customer_id = c.id
    `);
    res.json({ dashboardTable: reservations });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
  }
});

// User Dashboard Data
app.get('/api/user/dashboard', verifyToken, async (req, res) => {
  try {
    const [reservations] = await pool.query(`
      SELECT 
        r.id AS reservation_id,
        r.customer_id,
        r.room_type_id,
        rt.type AS room_type,
        r.start_date,
        r.end_date,
        r.status,
        COALESCE(r.amount, 0) AS amount,
        r.purpose,
        r.complaint,
        r.created_at,
        r.employment_status,
        r.housing_status,
        r.terms_agreed,
        r.other_loans,
        r.educational_purpose,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
      FROM reservations r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN customers c ON r.customer_id = c.id
      WHERE r.customer_id = ?
    `, [req.user.customer_id]);
    res.json({ dashboardTable: reservations });
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch user dashboard data', details: error.message });
  }
});

// Update Reservation Status (Admin-only)
app.put('/api/admin/reservations/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !['approved', 'declined', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid or missing status' });
  }
  try {
    const [result] = await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    const [reservation] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
    res.json(reservation[0]);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation', details: error.message });
  }
});

app.post('/api/repayments', verifyToken, async (req, res) => {
  const { customer_id, reservation_id, complaint, amount } = req.body;
  console.log('Received repayment request:', { customer_id, reservation_id, complaint, amount });
  if (!customer_id || !reservation_id || !amount) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (req.user.customer_id !== customer_id) {
    console.log('Unauthorized: customer_id mismatch', { req_user: req.user.customer_id, body_user: customer_id });
    return res.status(403).json({ error: 'Unauthorized' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    console.log('Fetching current loan details for reservation_id:', reservation_id);
    const [currentLoan] = await connection.query(
      'SELECT amount FROM reservations WHERE id = ? AND status = ?',
      [reservation_id, 'approved']
    );
    if (currentLoan.length === 0) {
      console.log('Loan not found or not approved for reservation_id:', reservation_id);
      throw new Error('Loan not found or not approved');
    }
    let currentAmount = parseFloat(currentLoan[0].amount);
    console.log('Current loan amount:', currentAmount);
    if (isNaN(currentAmount) || currentAmount < 0) {
      console.log('Invalid current loan amount:', currentAmount);
      throw new Error('Invalid current loan amount');
    }
    const paymentAmount = parseFloat(amount);
    console.log('Payment amount:', paymentAmount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      console.log('Invalid payment amount:', paymentAmount);
      throw new Error('Invalid payment amount');
    }
    if (paymentAmount > currentAmount) {
      console.log('Payment amount exceeds balance:', { paymentAmount, currentAmount });
      throw new Error('Payment amount exceeds remaining loan balance');
    }

    const newAmount = Math.max(0, currentAmount - paymentAmount);
    console.log('Calculated new amount:', newAmount);

    // Insert repayment first
    console.log('Recording repayment');
    const [result] = await connection.query(
      'INSERT INTO repayments (loan_id, amount, due_date, status, complaint) VALUES (?, ?, CURDATE(), ?, ?)',
      [reservation_id, paymentAmount, 'paid', complaint || null]
    );
    console.log('Repayment insert result:', result);

    let updateResult;
    if (newAmount === 0) {
      console.log('Attempting to delete reservation:', reservation_id);
      [updateResult] = await connection.query('DELETE FROM reservations WHERE id = ?', [reservation_id]);
      console.log('Delete result:', updateResult);
      if (updateResult.affectedRows === 0) {
        console.log('Failed to delete reservation');
        throw new Error('Failed to delete reservation');
      }
    } else {
      console.log('Updating reservation amount');
      [updateResult] = await connection.query(
        'UPDATE reservations SET amount = ? WHERE id = ?',
        [newAmount, reservation_id]
      );
      if (updateResult.affectedRows === 0) {
        console.log('Failed to update loan amount');
        throw new Error('Failed to update loan amount');
      }
    }
    console.log('Database update/delete result:', updateResult);

    await connection.commit();
    const [updatedReservation] = newAmount === 0 ? [] : await connection.query('SELECT * FROM reservations WHERE id = ?', [reservation_id]);
    res.json({
      id: result.insertId,
      message: newAmount === 0 ? 'Repayment recorded and loan fully paid, reservation deleted' : 'Repayment recorded successfully',
      updatedLoan: newAmount === 0 ? null : updatedReservation[0],
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating repayment:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create repayment', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Example Authentication Endpoint (for completeness)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Simulate authentication (replace with real logic)
  if (email === 'user@example.com' && password === 'password') {
    const token = jwt.sign({ userId: 15 }, SECRET_KEY, { expiresIn: '1h' }); // Example userId
    res.json({ user: { customer_id: 15, email, role: 'user' }, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Fetch All Reservations
app.get('/api/reservations', verifyToken, async (req, res) => {
  try {
    const [reservations] = await pool.query(`
      SELECT 
        r.id AS reservation_id,
        r.customer_id,
        r.room_type_id,
        rt.type AS room_type,
        r.start_date,
        r.end_date,
        r.status,
        COALESCE(r.amount, 0) AS amount,
        r.purpose,
        r.complaint,
        r.created_at,
        r.employment_status,
        r.housing_status,
        r.terms_agreed,
        r.other_loans,
        r.educational_purpose,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
      FROM reservations r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN customers c ON r.customer_id = c.id
      WHERE r.customer_id = ?
    `, [req.user.customer_id]);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});