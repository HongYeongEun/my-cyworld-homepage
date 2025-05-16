// PhotoGallery.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PhotoGallery = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3005/photo/upload', 
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert('사진첩에 글이 성공적으로 업로드되었습니다!');
        setTitle('');
        setContent('');
      } else {
        alert('업로드 실패');
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="photo-gallery-container">
      <h2>사진첩</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">업로드</button>
      </form>
    </div>
  );
};

export default PhotoGallery;
