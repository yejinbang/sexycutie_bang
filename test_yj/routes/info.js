// routes/info.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// 소단원(small) 목록 조회 API
router.get('/smalls', (req, res) => {
  db.all('SELECT DISTINCT small FROM info', [], (err, rows) => {
    if (err) return res.status(500).json({ error: '소단원 조회 실패' });
    const smalls = rows.map(r => r.small);
    res.json({ smalls });
  });
});

// 소단원별 소주제(subunit) 조회 API
router.get('/subunits', (req, res) => {
  const { small } = req.query;
  db.all(
    'SELECT subunit FROM info WHERE small = ?',
    [small],
    (err, rows) => {
      if (err) return res.status(500).json({ error: '소주제 조회 실패' });
      const subunits = rows.map(r => r.subunit);
      res.json({ subunits });
    }
  );
});

module.exports = router;
