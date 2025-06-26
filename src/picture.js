import React, { useEffect, useState } from 'react';
import PictureCommentForm from './PictureCommentForm';
import './App.css';
import './picture.css';

import { useAuth } from './auth/AuthContext'; // 로그인 정보 가져오기
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  const { user, setUser } = useAuth(); // 로그인한 사용자 정보
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [post] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [photoAlbumName, setPhotoAlbumName] = useState('');  // 사진첩 이름 (기본값 설정)
  const [isPhotoFormVisible, setIsPhotoFormVisible] = useState(false); // 사진첩 폼 표시 여부
  const [photoTitle, setPhotoTitle] = useState(''); // 사진 제목
  const [photoDescription, setPhotoDescription] = useState(''); // 사진 설명
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지
  const [photos, setPhotos] = useState([]); // 사진 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [photosPerPage] = useState(1); // 한 페이지당 사진 개수 (1로 설정하여 한 번에 1개만 표시)
const [currentPaginationRange, setCurrentPaginationRange] = useState([1, 5]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]); 
  const [query, setQuery] = useState('');
  const [friendList, setFriendList] = useState([]);
    const [todayVisitorCount, setTodayVisitorCount] = useState(0);
    const [totalVisitorCount, setTotalVisitorCount] = useState(0);
const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || null);
      useEffect(() => {
  const myUserId = user?.id;
  if (!myUserId) return;

  const fetchMyVisitCounts = async () => {
    try {
      const visitCountRes = await axios.get(`http://localhost:3005/home/visit-counts-by-id/${myUserId}`);
      setTodayVisitorCount(visitCountRes.data.todayVisits);
      setTotalVisitorCount(visitCountRes.data.totalVisits);
    } catch (err) {
      console.error('내 방문자 수 가져오기 실패:', err);
    }
  };

  fetchMyVisitCounts();
}, [user]);
 
 useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    setCurrentDate(`${month}월 ${date}일`);

    const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    setDaysInMonth([...Array(days)].map((_, i) => i + 1));

  }, [user]);

    useEffect(() => {
  if (!token) return;
  axios.get('http://localhost:3005/friends/list', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      setFriendList(res.data.friends || []);
    })
    .catch(err => {
      console.error('일촌 목록 불러오기 실패:', err);
    });
}, [token]);
    const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/membercy/search-users`, {
        params: { query }  // 검색어를 query 파라미터로 전달
      });
      setSearchResults(response.data.users);
      setError(null);  // 에러 초기화
    } catch (err) {
      setSearchResults([]);  // 검색 결과 초기화
      setError('사용자를 찾을 수 없습니다.');
    }
  };
    const handleChange = (e) => {
    setQuery(e.target.value);
  };
   useEffect(() => {
  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token'); // 🔐 저장된 JWT 토큰 꺼내기
      const res = await axios.get('http://localhost:3005/photos/photos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setPhotos(res.data.photos);
      } else {
        console.log('사진 목록 불러오기 실패');
      }
    } catch (error) {
      console.error('사진 목록 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchPhotos();
}, []);
 // 빈 배열로 마운트 시 한 번만 실행

  // 사용자 정보 및 프로필 이미지 가져오기
  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:3005/membercy/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (res.data.success) {
            const data = res.data.data;
            setHomeData(data);
            setProfileImage(data.profile_image || 'uploads/noimg.JPG');
          }
        })
        .catch(err => {
          console.error('회원 정보 불러오기 실패:', err);
        });
    }
  }, [user, token]);

  // 사진 제목 변경
  const handleTitleChange = (e) => setPhotoTitle(e.target.value);

  // 사진 설명 변경
  const handleDescriptionChange = (e) => setPhotoDescription(e.target.value);

  // 사진 선택 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleLogout = () => {
  console.log('로그아웃 시도');
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  setSelectedFriendId(null);
  navigate('/login');
};

  // 사진 업로드 및 글쓰기 폼 제출
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('caption', photoTitle);
  formData.append('description', photoDescription);
  formData.append('albumName', photoAlbumName);
  formData.append('userId', user?.id);
  formData.append('image', selectedImage);

  // 전송할 데이터 로그
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    console.log('서버로 전송하는 데이터:', formData);  // 보내는 데이터 확인
    const res = await axios.post('http://localhost:3005/photos/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('서버 응답:', res.data);  // 서버 응답 확인

    if (res.data.success) {
      alert('사진과 글이 성공적으로 업로드되었습니다!');
      setPhotoTitle('');  // 사진 제목 초기화
      setPhotoDescription('');  // 사진 설명 초기화
      setSelectedImage(null);  // 선택된 이미지 초기화

      // 폼 숨기기
      setIsPhotoFormVisible(false);  // 사진 업로드 폼 닫기
    } else {
      alert('업로드 실패, 다시 시도해주세요.');
    }
  } catch (err) {
    console.error('업로드 실패:', err);
    alert('업로드 실패, 다시 시도해주세요.');
  }
};
// 현재 페이지에 해당하는 사진을 가져오는 함수
  const indexOfLastPhoto = currentPage * photosPerPage; // 마지막 사진 인덱스
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage; // 첫 번째 사진 인덱스
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto); // 현재 페이지에 표시할 사진

  // 페이지 변경 처리 함수
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);

    // 페이지 번호에 따라 범위 조정
    if (pageNumber % 5 === 0) {
      setCurrentPaginationRange([pageNumber - 4, pageNumber]);
    } else if (pageNumber % 5 === 1 && pageNumber !== 1) {
      setCurrentPaginationRange([pageNumber, pageNumber + 4]);
    }
  };

  // 페이지네이션 버튼 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(photos.length / photosPerPage); i++) {
    pageNumbers.push(i);
  }

  // 페이지 번호 범위 슬라이싱 (최대 5개씩만 표시)
  const visiblePageNumbers = pageNumbers.slice(currentPaginationRange[0] - 1, currentPaginationRange[1]);


  return (
    <div>
      <div className="box1">
        <div className="search">
          <div className="search-title">사용자 검색</div>
          
          <div className="search-row">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="닉네임 검색"
            />
            <button onClick={handleSearch}>검색</button>
          </div>
      
          {/* 검색 결과 표시 */}
          {error && <p>{error}</p>}
      
          {searchResults.length > 0 ? (
            searchResults.map((user, idx) => (
              <div key={idx}>
                <Link to={`/${user.nickname}/mini-home`}>
                  {user.nickname}님의 미니홈피로 가기
                </Link>
              </div>
            ))
          ) : (
            query && <p></p>
          )}
        </div>
      
        <div className="friend-list">
          <h3>일촌 목록</h3>
          {friendList.length === 0 && <p>일촌이 없어요 😢</p>}
      
          {friendList.length > 0 && (
            <ul>
              {Array.from(
                new Map(friendList.map(friend => [friend.nickname, friend])).values()
              ).map(friend => (
                <li key={friend.id}>
                  <Link to={`/${friend.nickname}/mini-home`}>
                    {friend.nickname}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="logout-area">
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </div>
    <div className="bookcover">
      <div className="bookdot"></div>
      <div className="page">
        <div className="container1">
          <div className="item1">
          <strong>Today</strong> {todayVisitorCount}
          | <strong>Total</strong>  {totalVisitorCount}
        </div>
          <div className="item2">
            <div className="profile">
              {/* 프로필 이미지 표시 */}
              <img
                src={profileImage ? `http://localhost:3005/${profileImage.replace(/\\/g, '/')}` : 'http://localhost:3005/uploads/noimg.JPG'}
                alt="프로필 이미지"
              />
            </div>
            <div className="profile-dropdown">
              <div className="dropdown-button">
                프로필 ▼
              </div>
              <div className="dropdown-content">
                <a href="#">정보1</a>
                <a href="#">정보2</a>
              </div>
            </div>
            <div className="profile-text">
              안녕하세요!<br />
              {user?.nickname}님의 미니홈피에 오신 걸 환영합니다 💕
            </div>
          </div>
        </div>

        <div className="container2">
          <div className="item3">{user?.nickname}님의 미니홈피</div>
          <div className="item4">
              <div className="box content-box">
              <div className="calendar">
                <div className="date-today">
                  {/* 오늘 날짜 표시 */}
                  {currentDate}<br />
                  {new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}
                </div>
                <div className="date-list">
                  {daysInMonth.map((day, index) => (
                    <div key={index} className={`date ${day === new Date().getDate() ? 'date-red' : ''}`}>
                      <span>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="photo-gallery">
              {/* 사진첩 글쓰기 버튼 */}
             <div className="photo-button-container">
  <button onClick={() => setIsPhotoFormVisible(!isPhotoFormVisible)}>
    {isPhotoFormVisible ? '취소' : '사진올리기'}
  </button>
</div>


              {/* 사진첩 글쓰기 폼 표시 */}
              {isPhotoFormVisible && (
  <form onSubmit={handleSubmit} className="photo-form">
    <input
      type="text"
      value={photoTitle}
      onChange={handleTitleChange}
      placeholder="사진 제목"
    />
    <textarea
      value={photoDescription}
      onChange={handleDescriptionChange}
      placeholder="사진 설명"
    ></textarea>
    <input type="file" onChange={handleImageChange} />
    <button type="submit">사진 업로드</button>
  </form>
)}


            </div>
            <div>
<div className="photo-wrapper"> {/* ← 높이 제한 + 스크롤 담당 */}
  <div className="photo-gallery">
    {photos.length === 0 && !isPhotoFormVisible ? (
      <p className="no-photo-msg">📭 아직 등록된 사진이 없습니다!</p>
    ) : (
      currentPhotos.map((photo) => (
        <div key={photo.id} className="photo-item">
          <h3 className="photo-title">{photo.caption}</h3>
          <img
            src={`http://localhost:3005/${photo.image_url}`}
            alt={photo.caption}
          />
          <p>{photo.description}</p>
          <PictureCommentForm postId={photo.id} />
        </div>
      ))
    )}
  </div>
</div>



        <div className="pagination">
              {visiblePageNumbers.map(number => (
                <button key={number} onClick={() => paginate(number)}>
                  {number}
                </button>
              ))}
            </div>
    </div>
          </div>
        </div>

        <div className="container3">
          <div className="menu-container">
            <div className="menu-button">
              <Link to="/"><button>홈</button></Link>
              <Link to="/diary"><button>다이어리</button></Link>
              <Link to="/picture"><button>사진첩</button></Link>
              {/* <a href="guest.html"><button>방명록</button></a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
