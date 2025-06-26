import React, { useEffect, useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App(targetUserId) {
  const { user } = useAuth();
  const { nickname } = useParams();
//   console.log('받은 닉네임:', nickname);
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState(null);
  const [myFriends, setmyFriends] = useState(null);
  const token = localStorage.getItem('token');
  const myUserId = localStorage.getItem('myUserId');
  const [viewedUser, setViewedUser] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [friendReviews, setFriendReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [categoryData, setCategoryData] = useState({});
  const [todayVisitorCount, setTodayVisitorCount] = useState(0);
  const [totalVisitorCount, setTotalVisitorCount] = useState(0);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState('에픽하이 - Love Love Love.mp3');
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const senderId = currentUserId; // 예: 로그인한 유저
  const [ilchonpyungList, setIlchonpyungList] = useState([]);
  const homepageId = user?.nickname;
  const isOwnHome = viewedUser && String(currentUserId) === String(viewedUser.id);
    // 👇 아래에 콘솔 추가!
  console.log('viewedUser:', viewedUser);
  console.log('currentUserId:', currentUserId);
  console.log('viewedUser.id:', viewedUser?.id);
  console.log('isOwnHome:', isOwnHome);
    const loadIlchonpyung = async (userId) => {
      try {
        const response = await axios.get(`/api/ilchonpyung/${userId}`);
        setIlchonpyungList(response.data);
      } catch (error) {
        console.error('일촌평 불러오기 실패:', error);
      }
    };
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
  if (viewedUser?.id) {
    setOwnerId(viewedUser.id);
  }
}, [viewedUser]);
useEffect(() => {
  console.log('targetUserId:', targetUserId);
  if (targetUserId) {
    loadIlchonpyung(targetUserId);
  }
}, [targetUserId]);



const submitReview = () => {
  if (!newReview || !viewedUser?.id) return;

  axios.post('http://localhost:3005/friends/friend-review', {
    revieweeId: viewedUser.id,
    content: newReview
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    alert('일촌평 등록 완료!');
    setNewReview('');
    return axios.get(`http://localhost:3005/friends/friend-review/${viewedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  })
  .then(res => setFriendReviews(res.data.reviews))
  .catch(err => {
    console.error('일촌평 등록 실패:', err);
    alert('일촌평 등록 실패');
  });
};

useEffect(() => {
  if (viewedUser?.id && token) {
    axios.get(`http://localhost:3005/friends/friend-review/${viewedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFriendReviews(res.data.reviews);
    })
    .catch(err => {
      console.error('일촌평 불러오기 실패:', err);
    });
  }
}, [viewedUser?.id, token]);

console.log('일촌인지 여부:', isFriend);
  // 🔍 검색 핸들러
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/membercy/search-users`, {
        params: { query }
      });
      setSearchResults(res.data.users);
      setError(null);
    } catch {
      setSearchResults([]);
      setError('사용자를 찾을 수 없습니다.');
    }
  };

  const handleChange = (e) => setQuery(e.target.value);

  const goToProfile = (nickname) => {
    navigate(`/${nickname}`);
  };
useEffect(() => {
  if (user?.id) {
    setCurrentUserId(user.id);
  } else if (myUserId) {
    setCurrentUserId(myUserId);
  }
}, [user, myUserId]);
  useEffect(() => {
    console.log('받은 닉네임:', nickname);  // ✅ 이제 진짜 닉네임이 들어옴
  }, [nickname]);

  useEffect(() => {
    
  console.log('받은 닉네임2222:', nickname);  // 추가
  if (!nickname) return;

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/home/minihome/${nickname}`);
      console.log('서버 응답:', res.data.data);
      setUserInfo(res.data.data);
      setProfileImage(res.data.data.profile_image);
      setViewedUser(res.data.data);
    } catch (err) {
      console.error('유저 정보 불러오기 실패:', err);
    }
  };

  fetchUserInfo();
}, [nickname]);
function sendFriendRequest(senderId, receiverId) {
  console.log('일촌신청 요청 보냄:', senderId, receiverId);

  const token = localStorage.getItem('token');

  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  fetch('http://localhost:3005/friends/friend-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      from_user_id: senderId,   // ✅ 서버에서 기대하는 키
      to_user_id: receiverId    // ✅ 서버에서 기대하는 키
    }),
  })
    .then(res => res.json())
    .then(data => {
      alert('일촌 신청이 완료되었습니다!');
    })
    .catch(err => {
      console.error('일촌 신청 실패:', err);
      alert('일촌 신청에 실패했습니다.');
    });
}



useEffect(() => {
  if (userInfo) {
    // userInfo에 id가 없으면 nickname으로 id 요청하기
    if (!userInfo.id && userInfo.nickname) {
      axios.get(`http://localhost:3005/home/user-id/${userInfo.nickname}`)
        .then(res => {
          setViewedUser({ ...userInfo, id: res.data.id });
        })
        .catch(() => setViewedUser(userInfo));
    } else {
      setViewedUser(userInfo);
    }
  }
}, [userInfo]);

useEffect(() => {
  if (!nickname || !myUserId) return;

  const sendVisitAndFetchCounts = async () => {
    try {
      // 닉네임으로 userId 받아오기
      const userRes = await axios.get(`http://localhost:3005/home/user-id/${nickname}`);
      const homepageId = userRes.data.id;

      if (String(myUserId) !== String(homepageId)) {
        await axios.post('http://localhost:3005/home/visit', {
          userId: homepageId,
          visitorId: myUserId,
        });
      }

      // 방문자 수 가져오기
      const visitCountRes = await axios.get(`http://localhost:3005/home/visit-counts/${nickname}`);
      setTodayVisitorCount(visitCountRes.data.todayVisits);
      setTotalVisitorCount(visitCountRes.data.totalVisits);

    } catch (err) {
      console.error('방문자 기록 처리 중 오류 발생:', err);
    }
  };

  // StrictMode 중복 호출 대비 100ms 딜레이 추가
  const timer = setTimeout(sendVisitAndFetchCounts, 100);

  return () => clearTimeout(timer);
}, [nickname, myUserId]);










  // 📁 카테고리 최신글 불러오기
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

  // 🧑 추천 유저 목록 불러오기
  useEffect(() => {
    axios.get('http://localhost:3005/membercy/recommend-friends')
      .then(res => {
        if (res.data.success) {
          setRecommendedUsers(res.data.users);
        }
      })
      .catch(err => console.error('추천 유저 불러오기 실패:', err));
  }, []);




  // 🎵 BGM 재생 토글
  const toggleBGM = () => {
    const bgm = document.getElementById('bgm');
    if (bgmPlaying) {
      bgm.pause();
      setBgmPlaying(false);
      setSongTitle('');
    } else {
      bgm.play();
      setBgmPlaying(true);
      setSongTitle('Fly - Music Title');
    }
  };

  const categoryLabelColors = {
    다이어리: '#FFCDD2',
    사진첩: '#BBDEFB',
    pet: '#C8E6C9',
    food: '#FFE0B2',
    default: '#E0E0E0',
  };
  console.log('렌더링되는 값:', todayVisitorCount, totalVisitorCount);
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
  {/* ✅ 돌아가기 & 일촌신청 버튼 영역 */}
  <div className="friend-actions">
  {!isFriend && viewedUser?.id && currentUserId !== viewedUser.id && (
    <button onClick={() => sendFriendRequest(currentUserId, viewedUser.id)}>
      💌 일촌 신청
    </button>
  )}
  <Link to={`/${user?.nickname || 'default'}/`}>
    <button>🏠 내 미니홈피로 돌아가기</button>
  </Link>
</div>




</div>

 
   <div className="bookcover">
     <div className="bookdot"></div>
     <div className="page">
       {/* 상단 영역 */}
       <div className="container1">
         <div className="item1">
           <strong>Today</strong> {todayVisitorCount}
           | <strong>Total</strong>  {totalVisitorCount}
         </div>
         <div className="item2">
           <div className="profile">
             <img
               src={profileImage ? `http://localhost:3005/${profileImage.replace(/\\/g, '/')}` : 'http://localhost:3005/uploads/noimg.JPG'}
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
             안녕하세요!<br />
             {userInfo?.nickname}님의 미니홈피에 오신 걸 환영합니다 💕
           </div>
         </div>
       </div>
 
       {/* 중앙 컨텐츠 영역 */}
       <div className="container2">
         <div className="item3">{userInfo?.nickname}님의 미니홈피</div>
         <div className="item4">
           <div className="updated_news">📢 최근 소식</div>
           <div className="updated_news_content">
 
           </div>
 
           {/* 카테고리별 최근 글 */}
           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
             {/* 왼쪽 - 카테고리 최근글 */}
             <div className="category" style={{ flex: 1 }}>
               <div className="category_box"></div>
               <div className="category_box_content">
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
   {Object.entries(categoryData).map(([category, items]) => {
     const bgColor = categoryLabelColors[category] || categoryLabelColors.default;
 
     return (
       <li key={category} style={{ marginBottom: '20px' }}>
         <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
           {items.map(item => (
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
 
             {/* 오른쪽 - 요약 정보 */}
             <div className="summary" style={{ flex: 1 }}>
               <div className="summary_main">
                 <div className="summary_main_content">
                   <div className="summary_content_category">다이어리</div>
                   <div className="summary_content_count">8/25</div>
                 </div>
                 <div className="summary_main_content">
                   <div className="summary_content_category">사진첩</div>
                   <div className="summary_content_count">8/12</div>
                 </div>
               </div>
             </div>
           </div>
           {/* 미니룸 */}
         <div className="Miniroom">🏠 일촌평</div>


<div>
  {/* 작성 영역: 일촌일 때만 보여줌 */}
  {isFriend ? (
    <div>
      <textarea
        value={newReview}
        onChange={e => setNewReview(e.target.value)}
        placeholder="일촌평을 작성하세요."
        rows={3}
        style={{ width: '90%', resize: 'none', marginLeft: '20px' }}

      />
      <button onClick={submitReview}>등록</button>
    </div>
  ) : (
    <p style={{ color: 'gray', fontStyle: 'italic' }}>
      일촌이 되어야 일촌평을 작성할 수 있습니다.
    </p>
  )}

  {/* 일촌평 목록 */}
  <div
    style={{
      marginTop: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxHeight: '300px',
      overflowY: 'auto',
      paddingRight: '5px'
    }}
  >
    {friendReviews.map(review => (
      <div
        key={review.id}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#fefefe',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.05)'
        }}
      >
        <strong style={{ color: '#2c3e50' }}>{review.reviewer_nickname}</strong>
        <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{review.content}</p>
      </div>
    ))}
  </div>
</div>

      

         </div>
 
         
       </div>
 
       {/* 메뉴 영역 */}
       <div className="container3">
         <div className="menu-container">
           <div className="menu-button">
             <Link to="/"><button>홈</button></Link>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
 
     
   );
 }
 
 export default App;