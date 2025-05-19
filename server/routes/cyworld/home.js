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
router.post('/request', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: 'senderId, receiverId 모두 필요합니다.' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
      [senderId, receiverId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 요청됨 또는 친구 상태입니다.' });
    }

    await db.query(
      'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)',
      [senderId, receiverId]
    );

    // 알림 추가
    const message = '새 일촌 신청이 도착했습니다!';
    await db.query(
      `INSERT INTO notifications (sender_id, receiver_id, type, message) VALUES (?, ?, 'friend_request', ?)`,
      [senderId, receiverId, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '일촌 신청 실패' });
  }
});


router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [notifications] = await db.query(
      'SELECT n.id, n.sender_id, n.type, n.message, n.is_read, n.created_at, u.nickname AS sender_nickname FROM notifications n JOIN users u ON n.sender_id = u.id WHERE n.receiver_id = ? ORDER BY n.created_at DESC',
      [userId]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알림 조회 실패' });
  }
});

// 일촌 신청
router.post('/friends-request', authenticateJWT, async (req, res) => {
  console.log('친구 신청 데이터:', req.body);

  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: 'senderId, receiverId 모두 필요합니다.' });
  }

  try {
    const senderNum = Number(senderId);
const receiverNum = Number(receiverId);

if (isNaN(senderNum) || isNaN(receiverNum)) {
  return res.status(400).json({ message: 'senderId와 receiverId는 숫자여야 합니다.' });
}
    const [existing] = await db.query(
      'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
       [senderNum, receiverNum]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 요청됨 또는 친구 상태입니다.' });
    }

    await db.query(
  `INSERT INTO friend_requests (from_user_id, to_user_id, status) VALUES (?, ?, 'pending')`,
  [senderNum, receiverNum]
);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '일촌 신청 실패' });
  }
});

router.post('/friend-request/:requestId/respond', authenticateJWT, async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' 또는 'reject'
  const userId = req.user.user_id; // 인증 미들웨어에서 넣었다고 가정

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // 1) 요청 데이터 조회 및 본인 확인
    const [requests] = await db.execute(
      `SELECT * FROM friend_requests WHERE id = ? AND to_user_id = ? AND status = 'pending'`,
      [requestId, userId]
    );
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No pending friend request found' });
    }
    const request = requests[0];

    if (action === 'accept') {
  // 안전하게 undefined 체크 후 null로 대체
  const safeUserId = userId ?? null;
  const safeFromUserId = request.from_user_id ?? null;

  if (!safeUserId || !safeFromUserId) {
    return res.status(400).json({ message: 'Invalid user IDs' });
  }

  await db.execute(`UPDATE friend_requests SET status = 'accepted' WHERE id = ?`, [requestId]);

  await db.execute(
    `INSERT IGNORE INTO friends (user_id, friend_user_id) VALUES (?, ?), (?, ?)`,
    [safeUserId, safeFromUserId, safeFromUserId, safeUserId]
  );
console.log('userId:', userId);
console.log('request:', request);
console.log('request.from_user_id:', request.from_user_id);
  return res.json({ message: 'Friend request accepted' });
}
 else if (action === 'reject') {
      // 2) 친구 요청 상태 'rejected'로 변경
      await db.execute(`UPDATE friend_requests SET status = 'rejected' WHERE id = ?`, [requestId]);

      return res.json({ message: 'Friend request rejected' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// 예시: 최근 다이어리 글 1개, 사진첩 사진 1개 가져오기
// 최근 다이어리와 사진첩 글 2개씩 가져오기
router.get('/recent-categories/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const diaryQuery = `
      SELECT id, title, created_at, '다이어리' AS category
      FROM posts
      WHERE user_id = ?
      ORDER BY created_at DESC LIMIT 2;
    `;
    const [diaryRows] = await db.query(diaryQuery, [userId]);
    console.log('다이어리 최근 글:', diaryRows);  // 여기 찍어보기

    const photoQuery = `
      SELECT id, caption AS title, created_at, '사진첩' AS category
      FROM photos
      WHERE user_id = ?
      ORDER BY created_at DESC LIMIT 2;
    `;
    const [photoRows] = await db.query(photoQuery, [userId]);
    console.log('사진첩 최근 글:', photoRows);  // 여기 찍어보기

    const combined = [...diaryRows, ...photoRows];

    const grouped = combined.reduce((acc, cur) => {
      if (!acc[cur.category]) acc[cur.category] = [];
      acc[cur.category].push(cur);
      return acc;
    }, {});

    console.log('카테고리별 그룹:', grouped);  // 최종 결과도 찍기

    res.json(grouped);
  } catch (err) {
    console.error('최근 카테고리 글 조회 오류:', err);
    res.status(500).json({ success: false, message: '오류 발생' });
  }
});




router.get('/by-userid/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const [rows] = await db.query('SELECT id AS user_id, nickname FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: '사용자 없음' });
    }
  } catch (err) {
    console.error('유저 아이디로 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});


// router.get('/:nickname', async (req, res) => {
//   const nickname = req.params.nickname;
//   try {
//     const [rows] = await db.query('SELECT * FROM users WHERE id = nickname', [nickname]);
//     if (rows.length > 0) {
//       const user = rows[0];
//       res.json({
//         success: true,
//         data: {
//           nickname: user.nickname,
//           profile_image: user.profile_img,
//         },
//       });
//     } else {
//       res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
//     }
//   } catch (error) {
//     console.error('사용자 정보 로딩 실패:', error);
//     res.status(500).json({ success: false, message: '서버 오류' });
//   }
// });

router.get('/minihome/:nickname', async (req, res) => {
  const { nickname } = req.params;

  try {
    console.log('요청 받은 닉네임:', nickname);
    
    const [rows] = await db.query('SELECT * FROM users WHERE nickname = ?', [nickname]);
    console.log('쿼리 결과:', rows);

    if (rows.length === 0) {
      console.log('해당 닉네임 유저 없음');
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];
    console.log('유저 정보 반환:', user);

    res.json({
      success: true,
      data: {
        username: user.username,
        nickname: user.nickname,
        profile_image: user.profile_img,
        // 필요한 다른 필드도 여기서 추가하세요.
      }
    });
  } catch (error) {
    console.error('사용자 정보 로딩 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

router.post('/visit', async (req, res) => {
  const { userId, visitorId } = req.body;
  if (!userId || !visitorId) return res.status(400).json({ error: 'Invalid input' });

  const today = new Date().toISOString().split('T')[0];

  try {
    // 중복 검사 후 삽입
    const [existing] = await db.query(
      'SELECT * FROM visit_logs WHERE homepage_id = ? AND visitor_id = ? AND visit_date = ?',
      [userId, visitorId, today]
    );

    if (existing.length === 0) {
      await db.query(
        'INSERT INTO visit_logs (homepage_id, visitor_id, visit_date, created_at) VALUES (?, ?, ?, NOW())',
        [userId, visitorId, today]
      );
    }

    // 방문자 수 조회
    const [[{ todayVisits }]] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS todayVisits FROM visit_logs WHERE homepage_id = ? AND visit_date = ?',
      [userId, today]
    );

    const [[{ totalVisits }]] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS totalVisits FROM visit_logs WHERE homepage_id = ?',
      [userId]
    );

    res.json({ todayVisits, totalVisits });
  } catch (err) {
    console.error('방문 기록 오류:', err);
    res.status(500).json({ error: 'DB error' });
  }
});


router.get('/user-id/:nickname', async (req, res) => {
  const { nickname } = req.params;
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE nickname = ?', [nickname]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]); // { id: ... }
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});



router.get('/visit-counts/:nickname', async (req, res) => {
  try {
    // 모든 방문자 수 (중복 없는 방문자_id 기준)
    const [totalRows] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS totalVisits FROM visit_logs'
    );

    // 오늘 방문자 수도 마찬가지로 전체 방문자를 기준으로 세기
    const [todayRows] = await db.query(
      "SELECT COUNT(DISTINCT visitor_id) AS todayVisits FROM visit_logs WHERE visit_date = CURDATE()"
    );

    res.json({
      todayVisits: todayRows[0]?.todayVisits || 0,
      totalVisits: totalRows[0]?.totalVisits || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});


// GET /visit-counts-by-id/:userId
router.get('/visit-counts-by-id/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [todayRows] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS todayVisits FROM visit_logs WHERE homepage_id = ? AND visit_date = CURDATE()',
      [userId]
    );

    const [totalRows] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS totalVisits FROM visit_logs WHERE homepage_id = ?',
      [userId]
    );

    res.json({
      todayVisits: todayRows[0]?.todayVisits || 0,
      totalVisits: totalRows[0]?.totalVisits || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /visit-counts-by-id/:userId
router.get('/visit-counts-by-id/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [todayRows] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS todayVisits FROM visit_logs WHERE homepage_id = ? AND visit_date = CURDATE()',
      [userId]
    );

    const [totalRows] = await db.query(
      'SELECT COUNT(DISTINCT visitor_id) AS totalVisits FROM visit_logs WHERE homepage_id = ?',
      [userId]
    );

    res.json({
      todayVisits: todayRows[0]?.todayVisits || 0,
      totalVisits: totalRows[0]?.totalVisits || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});


// router.get('/visit-counts/:nickname', async (req, res) => {
//   const nickname = req.params.nickname;
//   console.log('받은 nickname:', nickname);

//   try {
//     const [userRows] = await db.query(
//       'SELECT * FROM users WHERE nickname = ?', [nickname]
//     );

//     if (userRows.length === 0) {
//       console.log('유저를 찾을 수 없습니다.');
//       return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
//     }

//     const user = userRows[0];

//     // 한국 시간 기준 날짜 구하기
//     const today = new Date().toLocaleDateString('ko-KR', {
//       timeZone: 'Asia/Seoul',
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     }).replace(/\. /g, '-').replace(/\./g, '');

//     console.log('오늘 날짜:', today);

//     const [todayVisitsRows] = await db.query(
//       `SELECT COUNT(*) AS todayVisits 
//        FROM visit_logs 
//        WHERE homepage_id = ? AND DATE(visit_date) = ?`,
//       [user.id, today]
//     );

//     const todayVisits = todayVisitsRows[0].todayVisits;

//     const [totalVisitsRows] = await db.query(
//       'SELECT COUNT(*) AS totalVisits FROM visit_logs WHERE homepage_id = ?',
//       [user.id]
//     );

//     const totalVisits = totalVisitsRows[0].totalVisits;

//     res.json({ todayVisits, totalVisits });
//   } catch (err) {
//     console.error('서버 오류:', err);
//     res.status(500).json({ error: '방문자 수 조회 실패' });
//   }
// });























 module.exports = router;
