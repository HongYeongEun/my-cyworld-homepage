const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // 실제 JWT 서명에 사용한 비밀 키

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // "Bearer token" → token 부분만 추출

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded; // ✅ 이후 req.user에서 사용자 정보 접근 가능
      next();
    } catch (err) {
      console.error("JWT 검증 실패:", err.message);
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } else {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }
}

module.exports = authenticateJWT;
