import React, { useEffect, useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthContext'; // 로그인 정보 가져오기
import axios from 'axios';
import back from './assets/pattern.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function App({currentUserId,onRespond  }) {
  const { user, setUser } = useAuth(); // 로그인한 사용자 정보
  const [viewedUser, setViewedUser] = useState(null);

  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const [friendReviews, setFriendReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [requests, setRequests] = useState([]);
  const [recentDiary, setRecentDiary] = useState('');
  const [recentPhoto, setRecentPhoto] = useState('');
  const [categoryData, setCategoryData] = useState({});
  const [todayVisitorCount, setTodayVisitorCount] = useState(0);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [query, setQuery] = useState('');  // 검색어 상태
  const [searchResults, setSearchResults] = useState([]);  // 검색 결과
  const [error, setError] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
    const [ilchonpyungList, setIlchonpyungList] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  // JWT Token을 localStorage에서 가져옵니다
  // const token = localStorage.getItem('token'); 
const myUserId = user?.id;
  // homepageId를 user.id로 설정
  const homepageId = user?.id;  // user.id가 있을 때만 사용하도록 조건 추가
  const { nickname } = useParams();
  // console.log("📌 currentUserId:", user?.id); 
  // 검색 버튼 클릭 시 실행되는 
  useEffect(() => {
  console.log('🔍 ownerId:', ownerId);
}, [ownerId]);
  const loadIlchonpyung = async (userId) => {
    try {
      const response = await axios.get(`/api/ilchonpyung/${userId}`);
      setIlchonpyungList(response.data);
    } catch (error) {
      console.error('일촌평 불러오기 실패:', error);
    }
  };

  useEffect(() => {
  if (user?.id) {
    setSelectedFriendId(user.id);
  }
}, [user]);

useEffect(() => {
  const fetchOwnerId = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/home/by-userid/${user.id}`);
      setOwnerId(res.data.user_id);
    } catch (err) {
      console.error('아이디로 유저 조회 실패:', err);
    }
  };

  if (nickname) {
    fetchOwnerId();

  }
}, [nickname]);

useEffect(() => {
  console.log("✅ myUserId:", myUserId, "(", typeof myUserId, ")");
  console.log("✅ ownerId:", ownerId, "(", typeof ownerId, ")");

  if (ownerId && myUserId) {
    const url = `http://localhost:3005/friends/check?userId=${myUserId}&friendId=${ownerId}`;
    console.log("🌐 Sending GET request to:", url);

    axios.get(url)
      .then(res => {
        console.log("🎯 Friend check response status:", res.status);
        console.log("🎯 Friend check response data:", res.data);
        setIsFriend(res.data.isFriend);
      })
      .catch(err => {
        if (err.response) {
          // 서버가 응답했지만 오류 코드가 있는 경우
          console.error("❌ Friend check error response:", err.response.status, err.response.data);
        } else if (err.request) {
          // 요청은 됐지만 응답이 없는 경우
          console.error("❌ Friend check no response:", err.request);
        } else {
          // 요청 설정 중 오류 발생
          console.error("❌ Friend check setup error:", err.message);
        }
      });
  }
}, [ownerId, myUserId]);
useEffect(() => {
  if (!user.id || !token) return;

  axios.get(`http://localhost:3005/friends/friend-review/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setFriendReviews(res.data.reviews))
  .catch(err => console.error('일촌평 불러오기 실패:', err));
}, [user.id, token]);




const submitReview = () => {
  if (!newReview || !selectedFriendId) return;

  axios.post('http://localhost:3005/friend-review', {
    revieweeId: selectedFriendId,
    content: newReview
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    alert('일촌평 등록 완료!');
    setNewReview('');
    // 최신 리뷰 다시 불러오기
    return axios.get(`http://localhost:3005/friend-review/${selectedFriendId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  })
  .then(res => setFriendReviews(res.data.reviews))
  .catch(err => {
    console.error('일촌평 등록 실패:', err);
    alert('일촌평 등록 실패');
  });
};
  const handleSearch = async () => {
  try {
    const response = await axios.get(`http://localhost:3005/membercy/search-users`, {
      params: { query }
    });

    // 중복 닉네임 제거
    const uniqueUsers = Array.from(
      new Map(response.data.users.map(user => [user.nickname, user])).values()
    );

    setSearchResults(uniqueUsers);
    setError(null);
  } catch (err) {
    setSearchResults([]);
    setError('사용자를 찾을 수 없습니다.');
  }
};


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

useEffect(() => {
    if (!token) return;

    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:3005/friends/friend-request/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error('알림 불러오기 실패:', err);
      }
    };

    fetchRequests();
    const intervalId = setInterval(fetchRequests, 10000);
    return () => clearInterval(intervalId);
  }, [token]);
const handleLogout = () => {
  console.log('로그아웃 시도');
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  setSelectedFriendId(null);
  navigate('/login');
};


  const handleRespond = async (requestId, action) => {
    try {
      await axios.post(`http://localhost:3005/friends/friend-request/${requestId}/respond`, { action }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 요청 완료하면 해당 요청 제거
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      alert(`일촌 요청이 ${action === 'accept' ? '수락' : '거절'}되었습니다.`);
    } catch (err) {
      console.error('응답 처리 실패:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };



// 방문 처리 누락된 부분
useEffect(() => {
  if (!homepageId || !myUserId) return;  // 내 아이디와 미니홈피 주인 아이디 모두 필요

  axios.post('http://localhost:3005/home/visit', {
    userId: homepageId,
    visitorId: myUserId,
  }).catch(err => {
    console.error('방문자 수 업데이트 실패:', err);
  });
}, [homepageId, myUserId]);

const handleAccept = async (requestId) => {
  try {
    const token = localStorage.getItem('token');  // 토큰 꺼내기
    await axios.post(
      `http://localhost:3005/home/friend-request/${requestId}/respond`,
      { action: 'accept' },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // 헤더에 토큰 넣기
        },
      }
    );
    setNewRequests((prev) => prev.filter((r) => r.id !== requestId));
    alert('일촌 신청을 수락했어요! 😊');
  } catch (err) {
    console.error('수락 실패:', err);
  }
};

const handleReject = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:3005/home/friend-request/${requestId}/respond`,
      { action: 'reject' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNewRequests((prev) => prev.filter((r) => r.id !== requestId));
    alert('일촌 신청을 거절했어요 😢');
  } catch (err) {
    console.error('거절 실패:', err);
  }
};



  // 검색어 입력 시 상태 업데이트
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // 검색된 유저 미니홈피로 이동하는 함수
const goToProfile = (nickname) => {
  navigate(`/${nickname}/mini-home`);  // /nickname/mini-home으로 리디렉션
};
useEffect(() => {
    if (!currentUserId) return;

    axios.get(`http://localhost:3005/notifications/${currentUserId}`)
      .then(res => {
        setNotifications(res.data.filter(n => !n.is_read));
      })
      .catch(console.error);
  }, [currentUserId]);
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
  console.log('📌 currentUserId:', currentUserId);

  if (!currentUserId) return;

  const fetchRequests = async () => {
    const res = await axios.get(`http://localhost:3005/friends/requests/${currentUserId}`);
    setNewRequests(res.data.requests);
  };

  fetchRequests();
}, [currentUserId]);


useEffect(() => {
  const fetchRecommendedUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3005/membercy/recommend-friends');
      if (res.data.success) {
        setRecommendedUsers(res.data.users); // 추천 유저 상태 저장
      }
    } catch (err) {
      console.error('추천 유저 불러오기 실패:', err);
    }
  };

  fetchRecommendedUsers();
}, []);


useEffect(() => {
  const fetchRecentCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/home/recent-categories/${ownerId}`);
      console.log('최근 카테고리 데이터:', res.data);  // 프론트에서 찍기
      setCategoryData(res.data);
    } catch (err) {
      console.error('최근 카테고리 불러오기 실패:', err);
    }
  };

  if (ownerId) {
    fetchRecentCategories();
  }
}, [ownerId]);



useEffect(() => {
  console.log('토큰 상태:', token);
}, [token]);
  useEffect(() => {
    console.log('현재 로그인한 사용자:', user);
    if (user && user.id) {
      // home data 가져오기
      axios.get(`http://localhost:3005/membercy/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
        }
      })
        .then(res => {
          if (res.data.success) {
            setHomeData(res.data.data); // 없으면 null, 있으면 데이터
          }
        })
        .catch(err => {
          console.error('홈 정보 불러오기 실패:', err);
        });

      // 프로필 이미지 가져오기
      axios.get(`http://localhost:3005/membercy/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 추가
        }
      })
        .then(res => {
          if (res.data.success) {
            setProfileImage(res.data.data.profile_image || 'uploads/noimg.JPG'); // 경로 포함
          }
        })
        .catch(err => {
          console.error('프로필 이미지 불러오기 실패:', err);
        });
    }
  }, [user, token]);

  const categoryLabelColors = {
    다이어리: '#FFCDD2',     // 연분홍
    사진첩: '#BBDEFB',   // 연하늘
    pet: '#C8E6C9',      // 연초록
    food: '#FFE0B2',     // 연주황
    default: '#E0E0E0',  // 회색
  };
console.log('selectedFriendId:', selectedFriendId);

  const uniqueFriends = Array.from(
  new Map(friendList.map(friend => [friend.nickname, friend])).values()
);
const filteredCategoryData = ownerId
  ? Object.fromEntries(
      Object.entries(categoryData).map(([category, items]) => [
        category,
        items.filter(item => item.user_id === ownerId),
      ])
    )
  : {};

  return (
  <div>
    {/* 🔔 일촌 신청 목록 */}
    {requests.map((req) => (
      <div key={req.id} style={{ marginBottom: 12 }}>
        <p>
          <b>{req.from_nickname}</b> 님이 일촌 신청을 보냈습니다.
        </p>
        <button
          onClick={() => handleRespond(req.id, 'accept')}
          style={{
            marginRight: 8,
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
          }}
        >
          수락
        </button>
        <button
          onClick={() => handleRespond(req.id, 'reject')}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
          }}
        >
          거절
        </button>
      </div>
    ))}

    {/* 🔍 사용자 검색 및 일촌 목록 */}
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
              new Map(
                friendList.map((friend) => [friend.nickname, friend])
              ).values()
            ).map((friend) => (
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

    {/* 🔓 로그아웃 버튼 */}
    <div className="logout-area">
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
    </div>

    {/* 📖 미니홈피 북 커버 */}
    <div className="bookcover">
      <div className="bookdot"></div>
      <div className="page">
        {/* 상단 */}
        <div className="container1">
          <div className="item1">
            <strong>Today</strong> {todayVisitorCount} | <strong>Total</strong>{' '}
            {totalVisitorCount}
          </div>
          <div className="item2">
            <div className="profile">
              <img
                src={
                  profileImage
                    ? `http://localhost:3005/${profileImage.replace(/\\/g, '/')}`
                    : 'http://localhost:3005/uploads/noimg.JPG'
                }
                alt="프로필 이미지"
              />
            </div>
            <div className="profile-dropdown">
              <div className="dropdown-button">프로필 ▼</div>
              <div className="dropdown-content">
                <a href="#">정보1</a>
                <a href="#">정보2</a>
              </div>
            </div>
            <div className="profile-text">
              안녕하세요!
              <br />
              {user?.nickname}님의 미니홈피에 오신 걸 환영합니다 💕
            </div>
          </div>
        </div>

        {/* 중앙 */}
        <div className="container2">
          <div className="item3">{user?.nickname}님의 미니홈피</div>

          <div className="item4">
            <div className="updated_news">📢 최근 소식</div>
            <div className="updated_news_content"></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              {/* 왼쪽 - 카테고리별 최근 글 */}
              <div className="category" style={{ flex: 1 }}>
                <div className="category_box"></div>
                <div className="category_box_content">
                  <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                    {Object.entries(categoryData).map(([category, items]) => {
                      const bgColor = categoryLabelColors[category] || categoryLabelColors.default;
                      return (
                        <li key={category} style={{ marginBottom: '20px' }}>
                          <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                            {items.map((item) => (
                              <li
                                key={item.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginBottom: '8px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: '#fafafa',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                  cursor: 'default',
                                }}
                              >
                                <span
                                  style={{
                                    backgroundColor: bgColor,
                                    color: '#333',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    marginRight: '12px',
                                    minWidth: '60px',
                                    textAlign: 'center',
                                    userSelect: 'none',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  {category}
                                </span>
                                <span style={{ fontSize: '1rem', color: '#444' }}>{item.title}</span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* 오른쪽 - 요약 */}
              <div className="summary" style={{ flex: 1 }}>
                <div className="summary_main">
                  <div className="summary_main_content">
                    <div className="summary_content_category">다이어리</div>
                    <div className="summary_content_count">8/25</div>
                  </div>
                  <div className="summary_main_content">
                    <div className="summary_content_category">사진첩</div>
                    <div className="summary_content_count">8/25</div>
                  </div>
                </div>
                <div className="summary_main">
                  <div className="summary_main_content">
                    <div className="summary_content_category">게시판</div>
                    <div className="summary_content_count">8/25</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 🏠 일촌평 */}
            <div className="Miniroom">🏠 일촌평</div>
            <div>
              {isFriend ? (
                <div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="일촌평을 작성하세요."
                    rows={3}
                    style={{ width: '90%', resize: 'none', marginLeft: '20px' }}
                  />
                  <button onClick={submitReview}>등록</button>
                </div>
              ) : (
                <p style={{ color: 'gray', fontStyle: 'italic' }}></p>
              )}

              <div
                style={{
                  marginLeft: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: '5px',
                }}
              >
                {friendReviews.length === 0 && <p>일촌평이 없습니다.</p>}
                {friendReviews.map((review) => (
                  <div key={review.id}>
                    <strong>{review.reviewer_nickname}</strong>
                    <p>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 메뉴 */}
        <div className="container3">
          <div className="menu-container">
            <div className="menu-button">
              <Link to="/"><button>홈</button></Link>
              <Link to="/diary"><button>다이어리</button></Link>
              <Link to="/picture"><button>사진첩</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
export default App;