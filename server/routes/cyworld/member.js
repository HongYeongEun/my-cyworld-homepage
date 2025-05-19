const express = require('express');
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const router = express.Router();
const authenticateJWT = require('./middleware/authenticateJWT');
const Visitor = require('./Visitor');
require('dotenv').config();

// const User = require('../models/User'); // 사용자 모델 불러오기
// JWT 키
const JWT_SECRET = process.env.JWT_SECRET;

// CORS 설정
router.use(
  cors({
    origin: 'http://localhost:3000', // React 클라이언트 주소
    credentials: true, // 쿠키를 클라이언트에 전달하도록 허용
  })
);

// JSON 파싱
router.use(express.json());

// 정적 파일 서빙
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
router.use('/images', express.static('public/images'));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


router.get('/recommend-friends', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, nickname, profile_image
      FROM users
      ORDER BY RAND()
      LIMIT 5
    `);
    res.status(200).json({ success: true, users: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 서버 코드 (Express)
router.get('/search-users', async (req, res) => {
  try {
    const { query } = req.query; // query 파라미터로 검색할 텍스트 받기

    if (!query) {
      return res.status(400).json({ success: false, message: '검색어가 필요합니다.' });
    }

    // 닉네임을 기준으로 검색
    const [results] = await db.query(`
      SELECT id, nickname, profile_img
      FROM users
      WHERE nickname LIKE ?  -- 닉네임이 검색어를 포함하는 사용자 찾기
      LIMIT 10;  -- 최대 10명만 반환
    `, [`%${query}%`]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      success: true,
      users: results,  // 검색된 사용자 목록 반환
    });
  } catch (err) {
    console.error('검색 실패:', err);
    res.status(500).json({
      success: false,
      message: '검색 중 오류 발생',
      error: err.stack,
    });
  }
});



// === 회원가입 ===
router.post('/join', upload.single('profile_img'), async (req, res) => {
  try {
    const { username, password, email, nickname, intro } = req.body;
    const profile_img = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, nickname, intro, profile_img) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, email, nickname, intro, profile_img]
    );
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ success: false, message: '회원가입에 실패했습니다.' });
  }
});
















// === 로그인 ===
// === 로그인 ===
// === 로그인 ===
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '아이디가 없습니다.' });  // 아이디가 없으면 404 반환
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: '잘못된 비밀번호' });  // 비밀번호가 틀린 경우 401 반환
    }

    // JWT 토큰 생성
    const payload = {
      user_id: user.id,
      username: user.username,
      nickname: user.nickname,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 동안 유효

    res.json({
      success: true,
      token: token,  // 토큰 반환
      user: {
        id: user.id,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error('로그인 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});


  

// === 로그아웃 ===
router.post('/logout', (req, res) => {
  // JWT는 서버에서 관리되지 않으므로 클라이언트에서 토큰을 삭제해야 함
  res.json({ success: true, message: '로그아웃 성공' });
});




// === 사용자 정보 ===
router.get('/me', authenticateJWT, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "사용자 정보가 없습니다." });
  }

  res.json({
    success: true,
    user: req.user,
  });
});


// === 사용자 정보 (ID로 조회) ===
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        success: true,
        data: {
          username: user.username,
          nickname: user.nickname,
          profile_image: user.profile_img,
        },
      });
    } else {
      res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('사용자 정보 로딩 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

router.get('/recommend-friends', async (req, res) => {
  try {

    const userId = req.user?.id; // req.user에 id가 있는지 확인

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is missing' });
    }

    const [results] = await promisePool.query(`
      SELECT id, nickname, profile_img 
      FROM users 
      WHERE id != ?  
      AND id NOT IN (  
        SELECT friend_id FROM friends WHERE user_id = ? 
        UNION
        SELECT user_id FROM friends WHERE friend_id = ?
      )
      ORDER BY RAND()  
      LIMIT 5;
    `, [userId, userId, userId]);

    if (results.length === 0) {
      console.log('추천할 유저가 없습니다.');
    }

    res.status(200).json({
      success: true,
      users: results,
    });
  } catch (err) {
    console.error('추천 유저 불러오기 실패:', err); // error stack 출력
    res.status(500).json({
      success: false,
      message: '추천 유저 불러오기 실패',
      error: err.stack, // stack trace도 포함
    });
  }
});






// 랜덤 유저 3명 추천
// Express 서버 예시
// router.get('/recommend-friends', async (req, res) => {
//   try {
//     const userId = req.user.id; // 사용자의 ID를 받아옴
//     const recommendedUsers = await getRecommendedUsersFromDatabase(userId); // 추천 유저 조회

//     if (!recommendedUsers.length) {
//       return res.status(404).json({ success: false, message: '추천할 유저가 없습니다.' });
//     }

//     res.status(200).json({ success: true, users: recommendedUsers });
//   } catch (err) {
//     console.error('추천 유저 불러오기 실패:', err.message); // 에러 로그에 구체적인 메시지 추가
//     res.status(500).json({ success: false, message: '추천 유저 불러오기 실패', error: err.message });
//   }
// });







module.exports = router;
