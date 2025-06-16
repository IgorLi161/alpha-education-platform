const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get one student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const {
      full_name, iin, email, phone, whatsapp, telegram,
      status, top_student, funding_source, discount_percent,
      paid_amount, total_cost, cohort_id, created_at, subject
    } = req.body;

    const result = await pool.query(`
      INSERT INTO students 
      (full_name, iin, email, phone, whatsapp, telegram, status, top_student, funding_source, discount_percent, paid_amount, total_cost, cohort_id, created_at, subject)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *;
    `, [
      full_name, iin, email, phone, whatsapp, telegram,
      status, top_student, funding_source, discount_percent,
      paid_amount, total_cost, cohort_id, created_at, subject
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update existing student
router.put('/:id', async (req, res) => {
  try {
    const {
      full_name, iin, email, phone, whatsapp, telegram,
      status, top_student, funding_source, discount_percent,
      paid_amount, total_cost, cohort_id, created_at, subject
    } = req.body;

    const { id } = req.params;

    const result = await pool.query(`
      UPDATE students SET 
      full_name=$1, iin=$2, email=$3, phone=$4, whatsapp=$5, telegram=$6, status=$7, top_student=$8, funding_source=$9, 
      discount_percent=$10, paid_amount=$11, total_cost=$12, cohort_id=$13, created_at=$14, subject=$15 
      WHERE id=$16 RETURNING *;
    `, [
      full_name, iin, email, phone, whatsapp, telegram,
      status, top_student, funding_source, discount_percent,
      paid_amount, total_cost, cohort_id, created_at, subject, id
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.send('Student deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
