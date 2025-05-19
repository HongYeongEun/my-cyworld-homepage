const express = require('express');
const db = require('../../db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const router = express.Router();
require('dotenv').config();

// 환경 변수로 JWT 비밀 키 가져오기
const JWT_SECRET = process.env.JWT_SECRET; // 환경변수에서 가져오고 없으면 기본값 사용

router.use(
  cors({
    origin: 'http://localhost:3000', // React 클라이언트 주소
    credentials: true, // 쿠키를 클라이언트에 전달하도록 허용
  })
);

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
router.use(express.json());

// 게시글에 달린 댓글 목록 조회(다이어리 페이지 )
router.get('/comments/:post_id', async (req, res) => {
  const post_id = req.params.post_id;
  console.log('댓글 조회 요청, post_id:', post_id); // post_id가 제대로 전달되었는지 확인

  try {
    const sql = `
      SELECT comments.id, comments.content, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `;
    const [rows] = await db.query(sql, [post_id]);

    console.log('댓글 조회 결과:', rows); // 데이터베이스에서 반환된 댓글 데이터 확인

    res.json({ success: true, comments: rows });
  } catch (error) {
    console.error('댓글 목록 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 목록 조회 중 오류 발생' });
  }
});

// GET /comments/photo/:photo_id
router.get('/photo/:photo_id', async (req, res) => {
  const photo_id = req.params.photo_id;

  try {
    const sql = `
      SELECT comments.id, comments.content, comments.created_at, users.username
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.photo_id = ?
      ORDER BY comments.created_at ASC
    `;
    const [rows] = await db.query(sql, [photo_id]);
    res.json({ success: true, comments: rows });
  } catch (error) {
    console.error('사진 댓글 조회 오류:', error);
    res.status(500).json({ success: false, message: '댓글 목록 조회 중 오류 발생' });
  }
});

// POST /comments/photo
router.post('/photo', async (req, res) => {
  const { photo_id, content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.user_id;;

    const sql = `INSERT INTO comments (user_id, photo_id, content) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [user_id, photo_id, content]);

    res.json({
      success: true,
      comment: {
        id: result.insertId,
        content,
        user_id,
        created_at: new Date(),
        username: decoded.username,
      },
    });
  } catch (error) {
    console.error('사진 댓글 작성 오류:', error);
    res.status(500).json({ success: false, message: '댓글 작성 실패' });
  }
});


router.post('/comments', async (req, res) => {
  console.log('📩 댓글 등록 요청 도착:', req.body); 
  const { post_id, content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '로그인 후 작성 가능합니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // 토큰 검증
    const user_id = decoded.user_id; // 사용자 ID 추출

    const sql = `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`;
    
    // ✅ await 방식으로 DB에 글 삽입
    const [result] = await db.query(sql, [post_id, user_id, content]);

    console.log('✅ 응답 보내기 직전');
    res.json({ success: true, message: '댓글이 성공적으로 등록되었습니다.' });
    console.log('✅ 응답 보냄');
    
  } catch (error) {
    console.error('댓글 작성 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 작성 중 오류 발생' });
  }
});

// PUT /comments/photo/:id
// 댓글 수정 라우터
router.put('/photo/:comment_id', authenticateJWT, async (req, res) => {
  const comment_id = req.params.comment_id;
  const { content } = req.body;
  const user_id = req.user.user_id;  // JWT에서 사용자 ID를 가져옴

  if (!content) {
    return res.status(400).json({ success: false, message: '댓글 내용을 입력해주세요.' });
  }

  try {
    // 댓글 작성자 ID 가져오기
    const sqlCheck = `SELECT user_id FROM comments WHERE id = ?`;
    const [rows] = await db.query(sqlCheck, [comment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
    }

    const commentUserId = rows[0].user_id;

    // 댓글 작성자가 아닌 경우 수정 불가
    if (user_id !== commentUserId) {
      return res.status(403).json({ success: false, message: '본인의 댓글만 수정할 수 있습니다.' });
    }

    // 댓글 수정
    const sqlUpdate = `UPDATE comments SET content = ? WHERE id = ?`;
    await db.query(sqlUpdate, [content, comment_id]);

    res.json({ success: true, message: '댓글이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('댓글 수정 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 수정 중 오류 발생' });
  }
});


// DELETE /comments/photo/:id
// 댓글 삭제 라우터
router.delete('/photo/:comment_id', authenticateJWT, async (req, res) => {
  const comment_id = req.params.comment_id;
  const user_id = req.user.user_id;  // JWT에서 사용자 ID를 가져옴

  try {
    // 댓글 작성자 ID 가져오기
    const sqlCheck = `SELECT user_id FROM comments WHERE id = ?`;
    const [rows] = await db.query(sqlCheck, [comment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
    }

    const commentUserId = rows[0].user_id;

    // 댓글 작성자가 아닌 경우 삭제 불가
    if (user_id !== commentUserId) {
      return res.status(403).json({ success: false, message: '본인의 댓글만 삭제할 수 있습니다.' });
    }

    // 댓글 삭제
    const sqlDelete = `DELETE FROM comments WHERE id = ?`;
    await db.query(sqlDelete, [comment_id]);

    res.json({ success: true, message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 삭제 중 오류 발생' });
  }
});




// 댓글 삭제 라우터
router.delete('/comments/:comment_id', authenticateJWT, async (req, res) => {
  const comment_id = req.params.comment_id;
  const user_id = req.user.user_id;  // JWT에서 사용자 ID를 가져옴

  try {
    // 댓글 작성자 ID 가져오기
    const sqlCheck = `SELECT user_id FROM comments WHERE id = ?`;
    const [rows] = await db.query(sqlCheck, [comment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
    }

    const commentUserId = rows[0].user_id;

    // 댓글 작성자가 아닌 경우 삭제 불가
    if (user_id !== commentUserId) {
      return res.status(403).json({ success: false, message: '본인의 댓글만 삭제할 수 있습니다.' });
    }

    // 댓글 삭제
    const sqlDelete = `DELETE FROM comments WHERE id = ?`;
    await db.query(sqlDelete, [comment_id]);

    res.json({ success: true, message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 삭제 중 오류 발생' });
  }
});
// 댓글 수정 라우터
router.put('/comments/:comment_id', authenticateJWT, async (req, res) => {
  const comment_id = req.params.comment_id;
  const { content } = req.body;
  const user_id = req.user.user_id;  // JWT에서 사용자 ID를 가져옴

  if (!content) {
    return res.status(400).json({ success: false, message: '댓글 내용을 입력해주세요.' });
  }

  try {
    // 댓글 작성자 ID 가져오기
    const sqlCheck = `SELECT user_id FROM comments WHERE id = ?`;
    const [rows] = await db.query(sqlCheck, [comment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
    }

    const commentUserId = rows[0].user_id;

    // 댓글 작성자가 아닌 경우 수정 불가
    if (user_id !== commentUserId) {
      return res.status(403).json({ success: false, message: '본인의 댓글만 수정할 수 있습니다.' });
    }

    // 댓글 수정
    const sqlUpdate = `UPDATE comments SET content = ? WHERE id = ?`;
    await db.query(sqlUpdate, [content, comment_id]);

    res.json({ success: true, message: '댓글이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('댓글 수정 중 오류:', error);
    res.status(500).json({ success: false, message: '댓글 수정 중 오류 발생' });
  }
});


module.exports = router;
