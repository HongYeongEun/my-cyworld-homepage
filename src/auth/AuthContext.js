import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ 새로고침 후에도 JWT로 로그인 상태 유지
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰 디코딩 또는 사용자 정보 요청
      axios.get('http://localhost:3005/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data.user); // 사용자 정보 복원
      })
      .catch(() => {
        setUser(null); // 토큰 유효하지 않음
      });
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
