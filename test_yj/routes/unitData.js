const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { grade, unit } = req.query;
  
  // 1. 지도서DB에서 학습목표 조회 (가이드 테이블)
  db.get(
    `SELECT goal FROM guide 
    WHERE grade = ? AND unit = ?`
    [grade, unit],
    (err, guideRow) => {
      if (err) return res.status(500).json({ error: '지도서DB 조회 실패' });

      // 2. 교과서DB에서 소주제 조회
      db.get(
        `SELECT subtopics FROM textbook 
        WHERE grade = ? AND unit = ?`,
        [grade, unit],
        (err, textRow) => {
          if (err) return res.status(500).json({ error: '교과서DB 조회 실패' });

          // 3. 응답 데이터 구성
          res.json({
            previousSummary: "이전 수업 요약 테스트",
            todayGoal: guideRow?.goal || '',
            todaySummary: "오늘의 요약 테스트",
            subTopics: textRow?.subtopics ? JSON.parse(textRow.subtopics) : []
          });
        }
      );
    }
  );
});
