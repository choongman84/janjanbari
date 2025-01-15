import React, { useEffect, useState } from 'react';
import { register } from '../../components/api/boardApi';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅 임포트

const BoardAddComponent = () => {
  const [boardData, setBoardData] = useState({
    title: '',
    content: '',
    memberId: null,
  });
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); // navigate 함수 사용

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    console.log("storedUser", JSON.parse(storedUser));
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // JSON 문자열을 객체로 변환
      const { user } = parsedUser
      console.log("user:", user);
      setUser(user);
      setBoardData(prevState => ({
        ...prevState,
        memberId: user.id,
        name: user.name, // memberId 설정
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoardData(prevState => ({
      ...prevState,
      [name]: value,

    }));
  };

  const handleSubmit = () => { // 입력데이터
    if (!boardData.title || !boardData.content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 게시글 등록 함수 호출
    register(boardData)
      .then(() => {
        alert('게시글이 성공적으로 추가되었습니다.');
        navigate('/board/list'); // 게시글 목록 페이지로 리디렉션
      })
      .catch(err => alert('게시글 추가 중 오류가 발생했습니다.'));
  };

  const handleCancel = () => { // 취소 버튼 클릭 시 게시글 목록으로 이동
    navigate('/board/list'); // 게시글 목록 페이지로 이동
  };

  return (
    <div className='flex flex-col p-4'>
      <h2>게시글 추가</h2>
      <div className='p-2'>
        <label htmlFor='title'>제목</label>
        <input
          className='border w-full p-1'
          name='title'
          placeholder='게시글 제목을 입력하세요'
          onChange={handleChange}
          value={boardData.title}
        />
      </div>
      <div className='p-2'>
        <label htmlFor='content'>내용</label>
        <textarea
          className='border w-full p-1'
          name='content'
          placeholder='게시글 내용을 입력하세요'
          onChange={handleChange}
          value={boardData.content}
          rows='5'
        />
      </div>
      <div className='flex justify-end space-x-2 p-2'>
        <button
          type='button'
          className='bg-blue-400 p-2'
          onClick={handleSubmit}
        >
          등록
        </button>
        <button
          type='button'
          className='bg-red-400 p-2'
          onClick={handleCancel}  // 취소 클릭 시 목록 페이지로 이동
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default BoardAddComponent;
