import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import './App.css';
import './diary.css';
import { useAuth } from './auth/AuthContext'; // 로그인 정보 가져오기
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  const { user, setUser } = useAuth(); // 로그인한 사용자 정보
  const [profileImage, setProfileImage] = useState('');
  const [query, setQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [friendList, setFriendList] = useState([]);
    const [todayVisitorCount, setTodayVisitorCount] = useState(0);
    const [totalVisitorCount, setTotalVisitorCount] = useState(0);
  const [post] = useState('');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [message, setMessage] = useState('');
const [comments, setComments] = useState([]);  // 기본값을 빈 배열로 설정
const [commentContent, setCommentContent] = useState(''); // 댓글 내용 상태
const [currentPostId, setCurrentPostId] = useState(null); // 현재 댓글이 속한 글 ID

  const [posts, setPosts] = useState([]); // 글 목록 상태 추가
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [postsPerPage] = useState(1); // 한 페이지에 보여줄 글의 수 (1개로 설정)
  const [showPostForm, setShowPostForm] = useState(false); // 글쓰기 폼 상태 추가
  const [editPostId, setEditPostId] = useState(null); // 수정하려는 글의 ID
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
    const [error, setError] = useState(null);
     const [searchResults, setSearchResults] = useState([]); 
  const [editVisibility, setEditVisibility] = useState('public'); // 수정용
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
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
  if (currentPostId) {
    // loadComments(currentPostId);
  }
}, [currentPostId]);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    setCurrentDate(`${month}월 ${date}일`);

    const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    setDaysInMonth([...Array(days)].map((_, i) => i + 1));

    if (user?.id) {
      loadUserHome(user.id);
      loadPosts(); // 글 목록 불러오기
    }
  }, [user]);

  useEffect(() => {
  if (post) {
    setCurrentPostId(post.id); // post가 바뀌면 설정
  }
}, [post]);



  const loadUserHome = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3005/membercy/${userId}`);
      if (res.data.success) {
        setProfileImage(res.data.data.profile_image || 'uploads/noimg.JPG');
      }
    } catch (err) {
      console.error('홈 정보 또는 프로필 이미지 불러오기 실패:', err);
    }
  };

  const loadPosts = async () => {
  try {
    const token = localStorage.getItem('token');  // 로컬 스토리지에서 토큰을 가져옵니다.
    if (!token) {
      console.error("로그인 후 다시 시도해주세요.");
      return;
    }

    const res = await axios.get('http://localhost:3005/posts/posts', {
      headers: {
        Authorization: `Bearer ${token}`,  // 헤더에 토큰을 추가합니다.
      },
    });

    if (res.data.success) {
      setPosts(res.data.posts); // 글 목록을 상태에 저장합니다.
    }
  } catch (err) {
    console.error('글 목록 불러오기 실패:', err);
  }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');  // 로컬 스토리지에서 토큰을 가져옵니다.

    if (!token) {
      console.error("토큰이 없습니다.");
      alert("로그인 후 다시 시도해주세요.");
      return;
    }

    const newPost = {
      title: title,
      content: content,
      visibility: visibility || 'public',
    };

    try {
      const response = await axios.post('http://localhost:3005/posts/post', newPost, {
        headers: {
          Authorization: `Bearer ${token}`,  // 헤더에 토큰을 추가합니다.
        },
      });
      console.log('글 작성 성공:', response.data);
      setMessage('글이 성공적으로 작성되었습니다!');
      loadPosts(); // 글 작성 후 목록을 새로고침
    } catch (error) {
      console.error('글 작성 실패:', error.response?.data || error.message);
      setMessage('글 작성 실패!');
    }
  };

  const handleLogout = () => {
  console.log('로그아웃 시도');
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  setSelectedFriendId(null);
  navigate('/login');
};

  const handleEdit = (post) => {
    
    setEditPostId(post.id); // 수정하려는 글의 ID
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditVisibility(post.visibility);
    setShowPostForm(true); // 수정 폼 열기
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰을 가져옵니다.

    if (!token) {
      console.error("토큰이 없습니다.");
      alert("로그인 후 다시 시도해주세요.");
      return;
    }

    const updatedPost = {
      title: editTitle,
      content: editContent,
      visibility: editVisibility || 'public',
    };

    try {
      const response = await axios.put(`http://localhost:3005/posts/post/${editPostId}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('글 수정 성공:', response.data);
      setMessage('글이 성공적으로 수정되었습니다!');
      loadPosts(); // 글 수정 후 목록을 새로고침
      setShowPostForm(false); // 수정 폼 닫기
    } catch (error) {
      console.error('글 수정 실패:', error.response?.data || error.message);
      setMessage('글 수정 실패!');
    }
  };
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
  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("토큰이 없습니다.");
      alert("로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3005/posts/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('글 삭제 성공:', response.data);
      loadPosts(); // 글 삭제 후 목록을 새로고침
    } catch (error) {
      console.error('글 삭제 실패:', error.response?.data || error.message);
      setMessage('글 삭제 실패!');
    }
  };

const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

const nextPage = () => {
  if (currentPage < Math.ceil(posts.length / postsPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};


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
      {/* ✅ box1 아래에 자연스럽게 배치 */}
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
                src={profileImage
                  ? `http://localhost:3005/${profileImage.replace(/\\/g, '/')}`
                  : 'http://localhost:3005/uploads/noimg.JPG'
                }
                alt="프로필 이미지"
              />
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
            <div className="post-list-container">
              
               <div className="button-container">
              <button onClick={() => setShowPostForm(!showPostForm)}>
                {showPostForm ? '취소' : '글쓰기'}
              </button>
            </div>
           

            {showPostForm && (
              <div className="diary-container">
                <h2>{editPostId ? '📔 글 수정' : '📔 오늘의 다이어리 작성'}</h2>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={editPostId ? editTitle : title}
                    onChange={(e) => editPostId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="내용을 입력하세요"
                    rows="10"
                    value={editPostId ? editContent : content}
                    onChange={(e) => editPostId ? setEditContent(e.target.value) : setContent(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>공개 범위: </label>
                  <select
                    value={editPostId ? editVisibility : visibility}
                    onChange={(e) => editPostId ? setEditVisibility(e.target.value) : setVisibility(e.target.value)}
                  >
                    <option value="public">전체공개</option>
                    <option value="friends">친구공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
                <button onClick={editPostId ? handleUpdate : handleSubmit}>
                  {editPostId ? '수정하기' : '작성하기'}
                </button>
                {message && <p>{message}</p>}
              </div>
            )}
              {!showPostForm && (
  <div className="post-list">
    {currentPosts.map((post) => (
      <div key={post.id} className="post-item">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <span>{post.created_at}</span>
        <hr />
        <CommentForm postId={post.id} />
      </div>
    ))}
  </div>
)}


            </div>
           
            {posts.length > 0 && (
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  이전
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                >
                  다음
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="container3">
          <div className="menu-container">
            <div className="menu-button">
              <Link to="/"><button>홈</button></Link>
              <Link to="/diary"><button>다이어리</button></Link>
              <Link to="/picture"><button>사진첩</button></Link>
              {/* <Link to="/guest"><button>방명록</button></Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
