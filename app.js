const express = require('express');
const cors = require('cors');
const app = express();

const progressRouter = require('./test_yj/routes/progress');


app.use(cors({
  origin: [
    'https://han-chanhee.github.io', // 프론트 github.io 주소
    'http://localhost:3000' // 로컬 개발용
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// API 라우터 연결
app.use('/api/progress', progressRouter);
// app.use('/api/unit-data', unitDataRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});


