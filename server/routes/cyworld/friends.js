const express = require('express');
const router = express.Router();
const db = require('../../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
require('dotenv').config();
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // 헤더에서 토큰 가져옴
  console.log("받은 Authorization 헤더:", req.headers['authorization']);  // 추가된 로그

  if (!token) {
    return res.status(403).json({ message: '토큰이 없습니다.' });
  }
    // ✅ 여기!
   
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

// 받은 일촌 신청 리스트 가져오기 (대기 상태만)
// 친구 신청 보내기
router.post('/friend-request', async (req, res) => {
  const { from_user_id, to_user_id } = req.body;

  if (!from_user_id || !to_user_id) {
    return res.status(400).json({ message: 'from_user_id, to_user_id는 필수입니다.' });
  }

  try {
    // 중복 검사 - friend_requests 테이블에서 이미 대기중인지 확인
    const [existingRequests] = await db.query(
      `SELECT * FROM friend_requests 
       WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
      [from_user_id, to_user_id]
    );

    if (existingRequests.length > 0) {
      return res.status(400).json({ message: '이미 일촌 신청을 보냈습니다.' });
    }

    // 이미 친구인지 friends 테이블에서 확인 (중복 방지)
    const [existingFriends] = await db.query(
      `SELECT * FROM friends 
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [from_user_id, to_user_id, to_user_id, from_user_id]
    );

    if (existingFriends.length > 0) {
      return res.status(400).json({ message: '이미 친구 관계입니다.' });
    }

    // friend_requests 테이블에 신청 저장
    await db.query(
      'INSERT INTO friend_requests (from_user_id, to_user_id, status, created_at) VALUES (?, ?, ?, NOW())',
      [from_user_id, to_user_id, 'pending']
    );

    res.json({ message: '일촌 신청 완료!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});



// 알림 조회
router.get('/friend-request/notifications', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [requests] = await db.query(
      `SELECT fr.id, fr.from_user_id, u.nickname AS from_nickname, fr.created_at
       FROM friend_requests fr
       JOIN users u ON fr.from_user_id = u.id
       WHERE fr.to_user_id = ? AND fr.status = 'pending'`,
      [userId]
    );

    res.json({ requests });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '알림 조회 실패' });
  }
});

// 요청 수락/거절
router.post('/friend-request/:requestId/respond', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id;
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' 또는 'reject'

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: '잘못된 action 값' });
  }

  try {
    // 요청 가져오기
    const [requests] = await db.query(
      'SELECT * FROM friend_requests WHERE id = ? AND to_user_id = ? AND status = "pending"',
      [requestId, userId]
    );
    if (requests.length === 0) {
      return res.status(404).json({ message: '대기중인 요청이 없습니다.' });
    }

    // 상태 업데이트
    await db.query(
      'UPDATE friend_requests SET status = ? WHERE id = ?',
      [action === 'accept' ? 'accepted' : 'rejected', requestId]
    );

    // 수락 시 friends 테이블에 친구 추가
    if (action === 'accept') {
      const fromUserId = requests[0].from_user_id;
      await db.query(
  'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)',
  [userId, fromUserId]
);
await db.query(
  'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)',
  [fromUserId, userId]
);
    }

    // 알림 추가
    const message = action === 'accept' ? '일촌 요청이 수락되었습니다!' : '일촌 요청이 거절되었습니다.';
    await db.query(
  'INSERT INTO notifications (sender_id, receiver_id, type, message, is_read) VALUES (?, ?, ?, ?, 0)',
  [
    requests[0].from_user_id,  // sender_id
    userId,                    // receiver_id (알림 받는 사람)
    action === 'accept' ? 'friend_accept' : 'friend_reject',
    message
  ]
);


    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '요청 처리 실패' });
  }
});


// 일촌 수락
// router.post('/friends/accept', async (req, res) => {
//   const { userId, friendId } = req.body;

//   try {
//     await db.query(
//       `UPDATE friends SET status = 'accepted' 
//        WHERE user_id = ? AND friend_id = ?`,
//       [friendId, userId] // 친구 요청이 friend → user 로 된 것이므로
//     );

//     // 양방향 친구 관계 저장 (선택 사항)
//     await db.query(
//       `INSERT IGNORE INTO friends (user_id, friend_id, status) VALUES (?, ?, 'accepted')`,
//       [userId, friendId]
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '일촌 수락 실패' });
//   }
// });

router.post('/friend-review', authenticateJWT, async (req, res) => {
  const reviewerId = req.user.user_id;
  const { revieweeId, content } = req.body;

  if (!revieweeId || !content) {
    return res.status(400).json({ message: 'revieweeId와 content가 필요합니다.' });
  }

  try {
    // 내가 일촌인 사람인지 확인
    const [rows] = await db.query(
      'SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = "accepted"',
      [reviewerId, revieweeId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: '일촌이 아니면 일촌평을 작성할 수 없습니다.' });
    }

    // 일촌평 저장
    await db.query(
      'INSERT INTO friend_reviews (reviewer_id, reviewee_id, content) VALUES (?, ?, ?)',
      [reviewerId, revieweeId, content]
    );

    res.json({ message: '일촌평이 등록되었습니다!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '일촌평 작성 실패' });
  }
});

router.get('/friend-review/:friendId', authenticateJWT, async (req, res) => {
  const friendId = req.params.friendId;
  
  try {
    const [reviews] = await db.query(
      `SELECT fr.id, u.nickname AS reviewer_nickname, fr.content, fr.created_at
       FROM friend_reviews fr
       JOIN users u ON fr.reviewer_id = u.id
       WHERE fr.reviewee_id = ?`,
      [friendId]
    );
    res.json({ reviews });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '일촌평 조회 실패' });
  }
});

// 친구 목록
router.get('/list', authenticateJWT, async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [rows] = await db.query(
      `SELECT f.*, 
        CASE 
          WHEN f.user_id = ? THEN u2.nickname 
          ELSE u1.nickname 
        END AS nickname
      FROM friends f
      LEFT JOIN users u1 ON f.user_id = u1.id
      LEFT JOIN users u2 ON f.friend_id = u2.id
      WHERE f.user_id = ? OR f.friend_id = ?`,
      [userId, userId, userId]
    );
    res.json({ friends: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '친구 목록 조회 실패' });
  }
});

// 예시: GET /friend/check?user1=1&user2=2
router.get('/friends/friend/check', async (req, res) => {
  const { userId, friendId } = req.query; // <- 프론트와 이름 맞춤
  console.log('Check friendship:', userId, friendId);

  try {
    const [rows] = await db.execute(
      'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [userId, friendId, friendId, userId]
    );
    res.json({ isFriend: rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check friendship' });
  }
});






module.exports = router;
