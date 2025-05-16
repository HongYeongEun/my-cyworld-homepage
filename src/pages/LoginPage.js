import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동용
import "../LoginPage.css";
import logo from "../assets/cyworld_logo.png";
import character from "../assets/CY3.PNG";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ useNavigate 사용
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/"); // user 상태가 변경되면 홈으로 이동
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3005/membercy/login", { // 로그인 API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      // 로그인 성공 시, JWT 토큰을 localStorage에 저장
      localStorage.setItem("token", data.token);

      // 콘솔에 토큰 출력
      console.log("로그인 성공! 저장된 토큰:", localStorage.getItem("token"));

      // 사용자 정보 상태에 저장
      setUser({
        id: data.user.id,
        nickname: data.user.nickname,
      });
  // ✅ 여기 추가 (내 ID 저장)
  localStorage.setItem("myUserId", data.user.id); // ← 이거!!
      alert(`${data.user.nickname}님 환영합니다!`);
      navigate("/"); // 로그인 성공 시 홈으로 이동
    } else {
      alert(data.message || "아이디가 없습니다. 회원가입 해주세요.");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
  }
};

  

  // `me` API를 호출하여 사용자 정보를 가져오는 함수
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
  
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3005/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // 헤더에 토큰 추가
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("사용자 정보:", data.user);
      } else {
        console.error("사용자 정보 조회 실패:", data.message);
      }
    } catch (error) {
      console.error("프로필 조회 오류:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="character-wrapper">
        <img src={character} alt="도트 캐릭터" className="dot-character" />
      </div>

      <div className="login-box">
        <img src={logo} alt="Cyworld Logo" className="cy-logo" />

        <form onSubmit={handleLogin} className="login-form">
          <label>아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">로그인</button>
        </form>

        <div className="login-footer">
          <a href="/signup">회원가입</a> | <a href="#">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
