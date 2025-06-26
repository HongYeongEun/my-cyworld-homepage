import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PictureCommentForm.css'
const CommentForm = ({ photoId }) => {
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // 댓글 목록 불러오기 (postId가 있을 때만)
  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/comment/photo/${photoId}`);
        if (res.data.success && Array.isArray(res.data.comments)) {
          setComments(res.data.comments);  // 응답에서 comments가 배열일 때만 상태 업데이트
        } else {
          console.log('댓글이 없습니다.');
        }
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };

    if (photoId) {
      loadComments();
    }
  }, [photoId]); // postId가 변경될 때마다 댓글 목록을 다시 불러옴

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 작성해주세요.');
      return;
    }

    const newComment = {
      photo_id: photoId,
      content: commentContent,
    };

    try {
      const res = await axios.post('http://localhost:3005/comment/photo', newComment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('댓글 작성 성공:', res.data);
      setCommentContent(''); // 댓글 작성 후 내용 초기화

      // 댓글 작성 후, 서버에서 받은 새로운 댓글을 상태에 추가
      if (res.data.comment) {
        setComments((prevComments) => {
          return [res.data.comment, ...prevComments]; // 새로운 댓글을 배열의 앞에 추가
        });
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 수정해주세요.');
      return;
    }

    const updatedComment = {
      content: editingContent,
    };

    try {
      const res = await axios.put(
        `http://localhost:3005/comment/photo/${editingCommentId}`,
        updatedComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('댓글 수정 성공:', res.data);

      // 댓글 수정 후 상태 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editingCommentId ? { ...comment, content: editingContent } : comment
        )
      );
      setEditingCommentId(null); // 수정 모드 종료
      setEditingContent('');
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const handleDeleteClick = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 삭제해주세요.');
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:3005/comment/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('댓글 삭제 성공:', res.data);

      // 댓글 삭제 후 상태 업데이트
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

return (
  <div className="comment-section">
    <div className="comment-list">
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-content">
                {editingCommentId === comment.id ? (
                  <div className="comment-edit">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <button onClick={handleEditSubmit}>수정 완료</button>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}
              </div>
              <div className="comment-actions">
                {editingCommentId !== comment.id && (
                  <>
                    <button onClick={() => handleEditClick(comment)}>수정</button>
                    <button onClick={() => handleDeleteClick(comment.id)}>삭제</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments">💬 댓글이 없습니다.</p>
      )}
    </div>

    <form onSubmit={handleCommentSubmit} className="comment-form">
      <input
        type="text"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <button type="submit">작성</button>
    </form>
  </div>
);

};
export default CommentForm;