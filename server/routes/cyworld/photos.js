const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../../db');

// 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos/');  // 파일을 저장할 위치
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`; // 파일명을 고유하게 설정
    cb(null, uniqueName);
  }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage }).single('image'); // 단일 파일 업로드

// 업로드 처리
// 사진 업로드 및 DB 저장 (Promise 사용)
router.post('/upload', upload, async (req, res) => { // upload 미들웨어를 여기에 직접 사용
  if (!req.file) {
    return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
  }

  const { caption, description, albumName, userId } = req.body;
  const imagePath = req.file.path.replace(/\\/g, '/');

  const query = 'INSERT INTO photos (user_id, image_url, caption, album_name, description) VALUES (?, ?, ?, ?, ?)';
  const values = [userId, imagePath, caption, albumName, description];

  try {
    // db.query는 promise로 사용해야 합니다.
    const [result] = await db.query(query, values);

    console.log('DB 저장 성공');
    res.json({
      success: true,
      message: '업로드 및 DB 저장 성공',
    });
  } catch (err) {
    console.error('DB 저장 실패:', err);
    return res.status(500).json({ success: false, message: 'DB 저장 실패' });
  }
});

// 사진 목록 불러오기
// 사진 목록 불러오기 (Promise 사용)
router.get('/photos', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM photos ORDER BY created_at DESC');
    res.json({
      success: true,
      photos: results, // DB에서 가져온 사진 목록 반환
    });
  } catch (err) {
    console.error('DB 조회 실패:', err);
    return res.status(500).json({ success: false, message: 'DB 조회 실패' });
  }
});

module.exports = router;
