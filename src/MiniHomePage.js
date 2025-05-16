import React, { useEffect, useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
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
  const [songTitle, setSongTitle] = useState('');
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
const [newComment, setNewComment] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
const [currentUserId, setCurrentUserId] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      writer: 'hoya',
      content: '일촌이 되어서 기뻐요! 😊',
      date: '2025-05-15',
    },
    {
      id: 2,
      writer: 'minji',
      content: '오늘도 좋은 하루 보내~!',
      date: '2025-05-14',
    },
  ]);

  const styles = {
 
  form: {
    marginBottom: '1rem',
  },
  textarea: {
    width: '70%',
    height: '30px',
    padding: '0.5rem',
    fontSize: '14px',
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    resize: 'none',
  },
  button: {
    marginRight:'0.5rem',
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#00000',
    color: 'black',
    border: 'none',
    cursor: 'pointer',
  },
  commentList: {
    listStyle: 'none',
    padding: 0,
  },
  commentItem: {
    background: '#fff',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderRadius: '0.5rem',
    
  },
  date: {
    fontSize: '0.8rem',
    color: '#999',
    marginLeft: '0.5rem',
  },
};
  const homepageId = user?.nickname;
  const isOwnHome = viewedUser && String(currentUserId) === String(viewedUser.id);
  // 👇 아래에 콘솔 추가!
console.log('viewedUser:', viewedUser);
console.log('currentUserId:', currentUserId);
console.log('viewedUser.id:', viewedUser?.id);
console.log('isOwnHome:', isOwnHome);

useEffect(() => {
  console.log("ownerId changed:", ownerId); // 찍히는지 확인

  if (ownerId) {
    console.log("Sending request to check friendship", myUserId, ownerId);

    axios.get(`http://localhost:3005/friends/friend/check?userId=${myUserId}&friendId=${ownerId}`)
      .then(res => {
        console.log("Friend check result:", res.data);
        setIsFriend(res.data.isFriend);
      })
      .catch(err => console.error("Friend check error:", err));
  }
}, [ownerId]);

 const handleSubmit = () => {
    if (!newComment.trim()) return;

    const newEntry = {
      id: comments.length + 1,
      writer: 'you', // 로그인 유저 기준
      content: newComment,
      date: new Date().toISOString().split('T')[0],
    };

    setComments([newEntry, ...comments]);
    setNewComment('');
  };
useEffect(() => {
  if (viewedUser?.id) {
    setOwnerId(viewedUser.id);
  }
}, [viewedUser]);


const submitReview = () => {
  if (!newReview || !viewedUser?.id) return;

  axios.post('http://localhost:3005/friend-review', {
    revieweeId: viewedUser.id,
    content: newReview
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    alert('일촌평 등록 완료!');
    setNewReview('');
    return axios.get(`http://localhost:3005/friend-review/${viewedUser.id}`, {
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
  if (viewedUser?.id) {
    axios.get(`http://localhost:3005/friend-review/${viewedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFriendReviews(res.data.reviews))
    .catch(err => console.error('일촌평 불러오기 실패:', err));
  }
}, [viewedUser]);
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
    axios.get('http://localhost:3005/home/recent-categories')
      .then(res => setCategoryData(res.data))
      .catch(err => console.error('카테고리 데이터 불러오기 실패:', err));
  }, []);

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

 useEffect(() => {
  if (ownerId && Array.isArray(myFriends) && myFriends.includes(ownerId)) {
    setIsFriend(true);
  } else {
    setIsFriend(false);
  }
}, [ownerId, myFriends]);


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
{/* <div style={{
  maxWidth: '270px',
  margin: '15px auto',
  padding: '15px',
  borderRadius: '12px',
  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
  color: '#3b2f0b',
  border: '1.5px solidrgb(0, 0, 0)',
}}>
  <h2 style={{
    textAlign: 'center',
    marginBottom: '12px',
    fontWeight: 'bold',
    fontSize: '18px',
  }}>
    사용자 검색 🔍
  </h2>
  
  <div style={{ display: 'flex', marginBottom: '12px' }}>
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="닉네임 검색"
      style={{
        flex: 1,
        padding: '8px 12px',
        borderRadius: '10px 0 0 10px',
        border: '1.5px solidrgb(0, 0, 0)',
        fontSize: '14px',
        outline: 'none'
      }}
    />
    <button
      onClick={handleSearch}
      style={{
        padding: '8px 16px',
        backgroundColor: '#e67e22',
        border: 'none',
        color: '#fff',
        borderRadius: '0 10px 10px 0',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d35400'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e67e22'}
    >
      검색
    </button>
  </div>

  {error && (
    <p style={{ color: '#c0392b', fontWeight: 'bold', textAlign: 'center', fontSize: '13px' }}>
      {error}
    </p>
  )}

  {searchResults.length > 0 ? (
    searchResults.map((user, idx) => (
      <div key={idx} style={{
        marginBottom: '8px',
        padding: '6px 10px',
        borderRadius: '8px',
        border: '1px solid #b9770e',
        backgroundColor: '#fff',
      }}>
        <Link to={`/${user.nickname}/mini-home`} style={{
          textDecoration: 'none',
          color: '#b9770e',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {user.nickname}님의 미니홈피로 가기
        </Link>
      </div>
    ))
  ) : (
    query && (
      <p style={{ textAlign: 'center', color: '#7d6608', fontStyle: 'italic', fontSize: '13px' }}>
        검색 결과가 없습니다.
      </p>
    )
  )}
</div> */}


 

 
 
 
 
<div className="box1">
  <div className="header">BGM</div>
  <div className="time" id="current-time"></div>
  <div className="search">
    <span id="songTitle">{songTitle}</span>
  </div>

  <div>
    <h2>사용자 검색</h2>
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="닉네임 검색"
    />
    <button onClick={handleSearch}>검색</button>
  
    {error && <p>{error}</p>}  {/* 검색 실패 메시지 */}
  
    {/* 검색 결과가 있을 경우, 목록 표시 */}
    {searchResults.length > 0 ? (
    searchResults.map((user, idx) => (
      <div key={idx}>
        <Link to={`/${user.nickname}/mini-home`}>
          {user.nickname}님의 미니홈피로 가기
        </Link>
      </div>
    ))
  ) : (
    query && <p>검색 결과가 없습니다.</p>  // query가 있을 때만 메시지 표시
  )}
  </div>

  <div className="controls">
    <button className="btn">⏪</button>
    <button className="btn" onClick={toggleBGM} id="playPauseBtn">
      {bgmPlaying ? '🔊 일시정지' : '🔊 재생'}
    </button>
    <button className="btn">⏩</button>
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
         {/* <h4 style={{ marginBottom: '10px', color: '#222', fontWeight: '700' }}>{category}</h4> */}
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
                   <div className="summary_content_count">8/25</div>
                 </div>
               </div>
               <div className="summary_main">
                 <div className="summary_main_content">
                   <div className="summary_content_category">게시판</div>
                   <div className="summary_content_count">8/25</div>
                 </div>
                 {/* <div className="summary_main_content">
                   <div className="summary_content_category">방명록</div>
                   <div className="summary_content_count">8/25</div>
                 </div> */}
               </div>
             </div>
           </div>
           {/* 미니룸 */}
         <div className="Miniroom">🏠 일촌평</div>
         <div style={styles.container}>
      <h3></h3>

      <div style={{
  display: 'flex',
  alignItems: 'center',
  border: '2px solid #ccc',
  borderRadius: '8px',
  padding: '8px',
  maxWidth: '600px',
  margin: '0 auto'
}}>
  <textarea
    placeholder="일촌에게 하고 싶은 말을 남겨보세요!"
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    style={{
      flex: 1,
      border: 'none',
      resize: 'none',
      height: '40px',
      outline: 'none',
      fontSize: '14px',
      marginRight: '10px',
      backgroundColor: 'transparent'
    }}
  />
  <button
    onClick={handleSubmit}
    style={{
      padding: '8px 16px',
      border: 'none',
      backgroundColor: '#007BFF',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
  >
    등록
  </button>
</div>


      <ul style={styles.commentList}>
        {comments.map((comment) => (
          <li key={comment.id} style={styles.commentItem}>
            <strong>{comment.writer}</strong> <span style={styles.date}>({comment.date})</span>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
         {/* <div>
  {/* 일촌 선택 UI 주석 처리 그대로 유지 
  
  {viewedUser && (
  <div>
    <h4>일촌평 목록</h4>
    {friendReviews.length === 0 ? (
      <p>아직 작성된 일촌평이 없어요.</p>
    ) : (
      <ul>
        {friendReviews.map(r => (
          <li key={r.id}>
            <b>{r.reviewer_nickname}:</b> {r.content}
          </li>
        ))}
      </ul>
    )}

    {isFriend ? (
      <>
        <textarea
          value={newReview}
          onChange={e => setNewReview(e.target.value)}
          placeholder="일촌평 작성하기..."
        />
        <button onClick={submitReview}>등록</button>
      </>
    ) : (
      <p style={{ color: 'red' }}>일촌이 아니면 일촌평을 작성할 수 없습니다.</p>
    )}
  </div>
)}

</div> */}

         </div>
 
         
       </div>
 
       {/* 메뉴 영역 */}
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