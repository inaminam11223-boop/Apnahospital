import express from 'express';
import db from '../lib/db.ts';
import { authenticateToken } from './auth.ts';

const router = express.Router();

// Get User Profile
router.get('/profile', authenticateToken, (req: any, res) => {
  const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(req.user.id);
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
  
  if (profile && profile.availability) {
    try {
      profile.availability = JSON.parse(profile.availability);
    } catch (e) {
      profile.availability = {};
    }
  }
  
  res.json({ ...user, profile });
});

// Update Profile
router.put('/profile', authenticateToken, (req: any, res) => {
  const { 
    specialization, license_number, address, phone, bio, fees, experience, availability,
    gender, dob, qualification, registration_number, hospital_name, languages, city, country, documents, image_url
  } = req.body;
  
  const stmt = db.prepare(`
    UPDATE profiles 
    SET specialization = ?, license_number = ?, address = ?, phone = ?, bio = ?, fees = ?, experience = ?, availability = ?,
        gender = ?, dob = ?, qualification = ?, registration_number = ?, hospital_name = ?, languages = ?, city = ?, country = ?, documents = ?, image_url = ?
    WHERE user_id = ?
  `);
  
  stmt.run(
    specialization, license_number, address, phone, bio, fees, experience, JSON.stringify(availability),
    gender, dob, qualification, registration_number, hospital_name, JSON.stringify(languages), city, country, JSON.stringify(documents), image_url,
    req.user.id
  );
  res.json({ success: true });
});

// Get Doctors (Verified Only)
router.get('/doctors', (req, res) => {
  const doctors = db.prepare(`
    SELECT 
      u.id, 
      u.name, 
      p.specialization, 
      p.fees, 
      p.experience, 
      p.bio, 
      p.availability, 
      p.image_url,
      (SELECT AVG(rating) FROM reviews WHERE doctor_id = u.id) as rating,
      (SELECT COUNT(*) FROM reviews WHERE doctor_id = u.id) as review_count
    FROM users u 
    JOIN profiles p ON u.id = p.user_id 
    WHERE u.role = 'doctor' AND p.verification_status = 'verified'
  `).all();
  res.json(doctors.map((d: any) => ({
    ...d,
    availability: d.availability ? JSON.parse(d.availability) : {}
  })));
});

// Admin: Get Pending Doctors
router.get('/admin/doctors/pending', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  
  const doctors = db.prepare(`
    SELECT u.id, u.name, u.email, p.*
    FROM users u 
    JOIN profiles p ON u.id = p.user_id 
    WHERE u.role = 'doctor' AND p.verification_status = 'pending'
  `).all();
  res.json(doctors.map((d: any) => ({
    ...d,
    availability: d.availability ? JSON.parse(d.availability) : {},
    documents: d.documents ? JSON.parse(d.documents) : {},
    languages: d.languages ? JSON.parse(d.languages) : []
  })));
});

// Admin: Verify Doctor
router.post('/admin/verify-doctor', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  
  const { doctor_id, status } = req.body; // status: 'verified' or 'rejected'
  
  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.prepare('UPDATE profiles SET verification_status = ? WHERE user_id = ?').run(status, doctor_id);
  res.json({ success: true });
});

// Book Appointment
router.post('/appointments', authenticateToken, (req: any, res) => {
  const { doctor_id, date, time_slot, notes } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO appointments (patient_id, doctor_id, date, time_slot, notes, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `);
  
  const result = stmt.run(req.user.id, doctor_id, date, time_slot, notes);
  res.json({ id: result.lastInsertRowid });
});

// Get Appointments (for Patient or Doctor)
router.get('/appointments', authenticateToken, (req: any, res) => {
  let stmt;
  if (req.user.role === 'doctor') {
    stmt = db.prepare(`
      SELECT a.*, u.name as patient_name 
      FROM appointments a 
      JOIN users u ON a.patient_id = u.id 
      WHERE a.doctor_id = ?
    `);
  } else {
    stmt = db.prepare(`
      SELECT a.*, u.name as doctor_name 
      FROM appointments a 
      JOIN users u ON a.doctor_id = u.id 
      WHERE a.patient_id = ?
    `);
  }
  const appointments = stmt.all(req.user.id);
  res.json(appointments);
});

// Check Doctor Availability
router.get('/appointments/check', authenticateToken, (req: any, res) => {
  const { doctor_id, date } = req.query;
  const stmt = db.prepare('SELECT time_slot FROM appointments WHERE doctor_id = ? AND date = ? AND status != "cancelled"');
  const bookedSlots = stmt.all(doctor_id, date);
  res.json(bookedSlots.map((s: any) => s.time_slot));
});

// Update Appointment Status
router.put('/appointments/:id', authenticateToken, (req: any, res) => {
  const { status, meeting_link } = req.body;
  // Only doctor can update status/link ideally, or admin
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
  }

  const stmt = db.prepare('UPDATE appointments SET status = ?, meeting_link = ? WHERE id = ?');
  stmt.run(status, meeting_link, req.params.id);
  res.json({ success: true });
});

// Create Prescription
router.post('/prescriptions', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Only doctors can create prescriptions' });
  
  const { appointment_id, patient_id, diagnosis, medicines, instructions } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, medicines, instructions)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(appointment_id, patient_id, req.user.id, diagnosis, JSON.stringify(medicines), instructions);
  res.json({ id: result.lastInsertRowid });
});

// Get Prescriptions
router.get('/prescriptions', authenticateToken, (req: any, res) => {
  let stmt;
  if (req.user.role === 'patient') {
    stmt = db.prepare(`
      SELECT p.*, u.name as doctor_name 
      FROM prescriptions p 
      JOIN users u ON p.doctor_id = u.id 
      WHERE p.patient_id = ?
    `);
  } else if (req.user.role === 'doctor') {
    stmt = db.prepare(`
      SELECT p.*, u.name as patient_name 
      FROM prescriptions p 
      JOIN users u ON p.patient_id = u.id 
      WHERE p.doctor_id = ?
    `);
  } else {
      // Pharmacy sees all? Or specific? For now let pharmacy see all to fulfill orders
      stmt = db.prepare(`
        SELECT p.*, u.name as patient_name, d.name as doctor_name
        FROM prescriptions p
        JOIN users u ON p.patient_id = u.id
        JOIN users d ON p.doctor_id = d.id
      `);
      // In a real app, pharmacy would only see prescriptions sent to them or via a code.
      // For this demo, we'll let pharmacies browse prescriptions to "fulfill" them or assume the patient brings it.
      // Better: Patient "sends" prescription to pharmacy.
      // Let's stick to: Patient views prescriptions.
      if (req.user.role === 'pharmacy') {
          return res.json([]); // Pharmacies see orders, not raw prescriptions usually unless sent.
      }
  }
  const prescriptions = stmt.all(req.user.id);
  res.json(prescriptions.map((p: any) => ({...p, medicines: JSON.parse(p.medicines)})));
});

// Create Order
router.post('/orders', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can place orders' });
  
  const { pharmacy_id, prescription_id, items } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO orders (patient_id, pharmacy_id, prescription_id, items, status, total_amount)
    VALUES (?, ?, ?, ?, 'processing', 0)
  `);
  
  const result = stmt.run(req.user.id, pharmacy_id, prescription_id, JSON.stringify(items || []));
  res.json({ id: result.lastInsertRowid });
});

// Get Orders
router.get('/orders', authenticateToken, (req: any, res) => {
  let stmt;
  if (req.user.role === 'patient') {
    stmt = db.prepare(`
      SELECT o.*, p.name as pharmacy_name 
      FROM orders o 
      LEFT JOIN users p ON o.pharmacy_id = p.id 
      WHERE o.patient_id = ?
    `);
  } else if (req.user.role === 'pharmacy') {
    stmt = db.prepare(`
      SELECT o.*, u.name as patient_name 
      FROM orders o 
      JOIN users u ON o.patient_id = u.id 
      WHERE o.pharmacy_id = ?
    `); // Pharmacy sees orders assigned to them.
    // But wait, how does patient choose pharmacy?
    // For now, let's assume orders are open or assigned.
    // If pharmacy_id is null, maybe all pharmacies see it?
    // Let's stick to direct assignment for simplicity or just list all for demo if pharmacy_id is null.
    if (req.user.role === 'pharmacy') {
       // If pharmacy_id is null, show all open orders?
       // Or just show orders where pharmacy_id matches.
       // Let's make patient select a pharmacy.
       // I need a route to get pharmacies.
    }
  } else {
      stmt = db.prepare('SELECT * FROM orders');
  }
  
  const orders = stmt ? stmt.all(req.user.id) : [];
  res.json(orders.map((o: any) => ({...o, items: JSON.parse(o.items)})));
});

// Get Pharmacies
router.get('/pharmacies', (req, res) => {
  const pharmacies = db.prepare("SELECT id, name FROM users WHERE role = 'pharmacy'").all();
  res.json(pharmacies);
});

// Create Review
router.post('/reviews', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can leave reviews' });
  
  const { doctor_id, rating, comment } = req.body;
  
  // Check if patient has a completed appointment with this doctor
  const appointment = db.prepare(`
    SELECT id FROM appointments 
    WHERE patient_id = ? AND doctor_id = ? AND status = 'completed'
  `).get(req.user.id, doctor_id);
  
  if (!appointment) {
    return res.status(403).json({ error: 'You can only review doctors after a completed appointment.' });
  }
  
  // Check if already reviewed
  const existingReview = db.prepare('SELECT id FROM reviews WHERE patient_id = ? AND doctor_id = ?').get(req.user.id, doctor_id);
  if (existingReview) {
    return res.status(400).json({ error: 'You have already reviewed this doctor.' });
  }

  const stmt = db.prepare(`
    INSERT INTO reviews (patient_id, doctor_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(req.user.id, doctor_id, rating, comment);
  res.json({ id: result.lastInsertRowid });
});

// Get Doctor Reviews
router.get('/reviews/:doctorId', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.name as patient_name 
    FROM reviews r 
    JOIN users u ON r.patient_id = u.id 
    WHERE r.doctor_id = ?
    ORDER BY r.created_at DESC
  `).all(req.params.doctorId);
  res.json(reviews);
});

// Medical Records
router.get('/medical-records', authenticateToken, (req: any, res) => {
  const records = db.prepare('SELECT * FROM medical_records WHERE patient_id = ? ORDER BY uploaded_at DESC').all(req.user.id);
  res.json(records);
});

router.post('/medical-records', authenticateToken, (req: any, res) => {
  const { title, file_url, file_type, doctor_id } = req.body;
  const stmt = db.prepare('INSERT INTO medical_records (patient_id, doctor_id, title, file_url, file_type) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(req.user.id, doctor_id, title, file_url, file_type);
  res.json({ id: result.lastInsertRowid });
});

// Messages
router.get('/messages/:userId', authenticateToken, (req: any, res) => {
  // Get messages between current user and another user
  const messages = db.prepare(`
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `).all(req.user.id, req.params.userId, req.params.userId, req.user.id);
  res.json(messages);
});

router.post('/messages', authenticateToken, (req: any, res) => {
  const { receiver_id, content, file_url } = req.body;
  const stmt = db.prepare('INSERT INTO messages (sender_id, receiver_id, content, file_url) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.user.id, receiver_id, content, file_url);
  res.json({ id: result.lastInsertRowid });
});

// Notifications
router.get('/notifications', authenticateToken, (req: any, res) => {
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(notifications);
});

router.put('/notifications/:id/read', authenticateToken, (req: any, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

export default router;

