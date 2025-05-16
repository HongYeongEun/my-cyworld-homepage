import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./home";
import Diary from "./diary";
import Picture from "./picture";
import MiniHomePage from "./MiniHomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 로그인된 경우, nickname을 URL에 추가하여 MiniHomepage를 렌더링 */}
      <Route 
        path="/" 
        element={user ? <Navigate to={`/${user.id}`} /> : <Navigate to="/login" />} 
      />
      
      {/* 로그인한 유저의 미니홈피 */}
      <Route 
        path="/:nickname" 
        element={user ? <Home /> : <Navigate to="/login" />} 
      />
      
      {/* 미니홈피 페이지 (nickname이 주어진 상태에서) */}
      <Route 
        path="/:nickname/mini-home" 
        element={<MiniHomePageWithParams />} 
      />
      
      {/* 로그인 페이지 */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      
      {/* 회원가입 페이지 */}
      <Route path="/signup" element={<SignupPage />} />
      
      {/* 다이어리 페이지 */}
      <Route path="/diary" element={<Diary />} />
      
      {/* 사진첩 페이지 */}
      <Route path="/picture" element={<Picture />} />
    </Routes>
  );
}

function MiniHomePageWithParams() {
  const { nickname } = useParams();  // URL에서 nickname 가져오기
  return <MiniHomePage nickname={nickname} />;  // nickname props 전달
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
