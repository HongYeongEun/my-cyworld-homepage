// src/pages/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 중괄호 필요!
import "../SignupPage.css";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    nickname: "",
    intro: "",
    profile_img: null,
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('nickname', formData.nickname);
    formDataToSend.append('intro', formData.intro);
    if (formData.profile_img) formDataToSend.append('profile_img', formData.profile_img);
  
    try {
      const response = await fetch("http://localhost:3005/membercy/join", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (data.success) {
        alert(data.message); // 회원가입 완료 메시지
        navigate("/login");  // ✅ 로그인 페이지로 이동
      } else {
        alert("회원가입 실패!");
      }
    } catch (error) {
      console.error("회원가입 중 에러:", error);
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>아이디</label>
          <input type="text" name="username" onChange={handleChange} required />

          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required />

          <label>이메일</label>
          <input type="email" name="email" onChange={handleChange} required />

          <label>닉네임</label>
          <input type="text" name="nickname" onChange={handleChange} required />

          <label>프로필 이미지</label>
          <input type="file" name="profile_img" accept="image/*" onChange={handleChange} />

          <label>한줄소개</label>
          <input type="text" name="intro" onChange={handleChange} maxLength={50} />

          <button type="submit">가입하기</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
