const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { className } = req.query;

  // 1. 이전진도(progress) 조회
  db.get(
    'SELECT progress FROM class WHERE class_name = ?',
    [className],
    (err, classRow) => {
      if (err) return res.status(500).json({ error: 'DB 조회 실패' });
      if (!classRow) return res.json({ prevProgress: '', nextProgress: '', progressList: [] });

      const prevProgress = classRow.progress;

      // 2. info에서 progress와 일치하는 subunit의 id 찾기
      db.get(
        'SELECT id FROM info WHERE subunit = ?',
        [prevProgress],
        (err, infoRow) => {
          if (err) return res.status(500).json({ error: 'info 조회 실패' });

          if (!infoRow) {
            // 일치하는 소주제가 없으면 다음진도 없음
            return res.json({ prevProgress, nextProgress: '', progressList: [] });
          }

          const nextId = infoRow.id + 1;

          // 3. 다음 소주제(subunit) 찾기
          db.get(
            'SELECT subunit FROM info WHERE id = ?',
            [nextId],
            (err, nextRow) => {
              if (err) return res.status(500).json({ error: '다음진도 조회 실패' });

              const nextProgress = nextRow ? nextRow.subunit : '';
              // 필요시 전체 소주제(progressList)도 함께 반환
              db.all('SELECT subunit FROM info', [], (err, allRows) => {
                const progressList = allRows ? allRows.map(r => r.subunit) : [];
                res.json({ prevProgress, nextProgress, progressList });
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
