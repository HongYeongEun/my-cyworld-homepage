const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../db');
const cors = require('cors');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// CORS 설정 (쿠키 안 쓰면 credentials: true 생략 가능)
router.use(
  cors({
    origin: 'http://localhost:3000',
    // credentials: true, // JWT는 일반적으로 쿠키 대신 헤더로 전달 → 필요 없다면 주석처리
  })
);

// ✅ 인증 미들웨어 - JWT_SECRET 변수로 통일
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // 헤더에서 토큰 가져옴
  console.log("받은 Authorization 헤더:", req.headers['authorization']);  // 추가된 로그

  if (!token) {
    return res.status(403).json({ message: '토큰이 없습니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    console.log("검증된 사용자 정보:", user);  // 추가 로그

    if (!user || !user.user_id) {
      return res.status(400).json({ message: '유효한 사용자 정보가 없습니다.' });
    }

    req.user = user;  // user 객체에 JWT 페이로드 정보(id 등) 담겨 있음
    next();
  });
};







// ✅ 게시글 작성 라우터
router.post('/post', async (req, res) => {
  console.log('📩 글 등록 요청 도착:', req.body); 
  const { title, content, visibility } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '로그인 후 작성 가능합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // 토큰 검증
    const user_id = decoded.user_id; // 사용자 ID 추출

    const sql = `INSERT INTO posts (user_id, title, content, visibility) VALUES (?, ?, ?, ?)`;
    
    // ✅ await 방식으로 DB에 글 삽입
    const [result] = await db.query(sql, [user_id, title, content, visibility]);

    console.log('✅ 응답 보내기 직전');
    res.json({ success: true, message: '게시물이 성공적으로 등록되었습니다.' });
    console.log('✅ 응답 보냄');
    
  } catch (error) {
    console.error('글 작성 중 오류:', error);
    res.status(500).json({ success: false, message: '글 작성 중 오류 발생' });
  }
});


router.get('/posts', authenticateJWT, async (req, res) => {
  console.log('📩 글 목록 요청 도착');
  
  // 인증된 사용자의 ID 가져오기
  const userId = req.user.user_id;

  try {
    // 해당 사용자가 작성한 게시물 목록 가져오기
    const sql = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';  // 작성자 ID에 맞는 게시물만 가져옴
    const [rows] = await db.query(sql, [userId]);  // DB에서 데이터 가져오기

    console.log('✅ 글 목록 응답 보내기 직전');
    res.json({ success: true, posts: rows });
    console.log('✅ 글 목록 응답 보냄');
    
  } catch (error) {
    console.error('글 목록 가져오기 중 오류:', error);
    res.status(500).json({ success: false, message: '글 목록 가져오기 중 오류 발생' });
  }
});




// ✅ 게시글 수정 라우터
router.put('/post/:id', authenticateJWT, async (req, res) => {
  const { title, content, visibility } = req.body;
  const postId = req.params.id;
  const userId = req.user.user_id;  // 인증된 사용자 ID

  try {
    // 해당 게시물 가져오기
    const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);

    if (post.length === 0) {
      return res.status(404).json({ success: false, message: '게시물이 존재하지 않습니다.' });
    }

    // 게시물 작성자와 요청자가 일치하는지 확인
    if (post[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }

    // 게시물 수정
    const sql = 'UPDATE posts SET title = ?, content = ?, visibility = ? WHERE id = ?';
    await db.query(sql, [title, content, visibility, postId]);

    res.json({ success: true, message: '게시물이 수정되었습니다.' });
    
  } catch (error) {
    console.error('게시글 수정 중 오류:', error);
    res.status(500).json({ success: false, message: '게시글 수정 중 오류가 발생했습니다.' });
  }
});
 // ✅ 게시글 삭제 라우터
router.delete('/post/:id', authenticateJWT, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.user_id;  // 인증된 사용자 ID

  try {
    // 해당 게시물 가져오기
    const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);

    if (post.length === 0) {
      return res.status(404).json({ success: false, message: '게시물이 존재하지 않습니다.' });
    }

    // 게시물 작성자와 요청자가 일치하는지 확인
    if (post[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: '권한이 없습니다.' });
    }

    // 게시물 삭제
    const sql = 'DELETE FROM posts WHERE id = ?';
    await db.query(sql, [postId]);

    res.json({ success: true, message: '게시물이 삭제되었습니다.' });
    
  } catch (error) {
    console.error('게시글 삭제 중 오류:', error);
    res.status(500).json({ success: false, message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
