var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const pool = require('../db');

router.post('/submit', async function(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }
  try {
    await pool.query(
      'INSERT INTO submissions (name, email) VALUES ($1, $2)',
      [name, email]
    );
    res.json({ received: { name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;
