import React, { useState, useEffect } from 'react';
import { useNavigate ,useParams} from 'react-router-dom';  // useNavigate를 임포트해야 합니다.
import { fetchMyPageList } from '../../components/api/memberApi';  // API 호출 함수 임포트
import { getCommentsByBoardId } from '../../components/api/commentApi'; // 댓글 API 호출 함수 임포트
import { getList, deleteBoard, searchBoard } from "../../components/api/boardApi";
import { getBoardById, updateBoard } from "../../components/api/boardApi";

const BoardPage = (token) => {
  const [myPageData, setMyPageData] = useState(null);  // 상태 초기화
  const [error, setError] = useState("");  // 에러 상태 초기화
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

  const storedUser = localStorage.getItem("auth");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const { user } = parsedUser || {};  // user가 없을 경우 안전하게 처리
  const [boardList, setBoardList] = useState([]); //게시글 삭제
  const [isEditing, setIsEditing] = useState(false); // 수정
  const [editedBoard, setEditedBoard] = useState({ title: "", content: "" });
  const { bno } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          alert("Member ID is missing. Please log in again.");
          navigate("/members/login");
          return;
        }

        const data = await fetchMyPageList(user.id);
        console.log("Fetched MyPage Data:", data);
        setMyPageData(data);

        // 각 게시글에 대해 댓글 가져오기
        const boardsWithComments = await Promise.all(data.boards.map(async (board) => {
          const comments = await getCommentsByBoardId(board.bno);
          return { ...board, comments }; // 댓글 추가
        }));

        setMyPageData((prevData) => ({ ...prevData, boards: boardsWithComments }));
      } catch (err) {
        console.error("Error fetching MyPage data:", err);
        setError("Failed to load MyPage data. Please try again.");
      }
    };

    fetchData();
  }, [navigate]);

    // 게시글 삭제
    const handleDelete = async (bno) => {
      const confirmDelete = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");
      if (!confirmDelete) return; 
  
      try {
        await deleteBoard(bno);
        setBoardList(boardList.filter((board) => board.bno !== bno));
      } catch (error) {
        alert("게시글 삭제에 실패했습니다.");
      }
    };
    useEffect(() => {
      const fetchBoards = async () => {
        try {
          const data = await getList(token);
          console.log("받아온 게시글 데이터:", data);
          setBoardList(data);
        } catch (error) {
          console.error("게시글 목록 불러오기 실패:", error);
        }
      };
      fetchBoards();
    }, [token]);

    useEffect(() => {
      const fetchBoardData = async () => {
        try {
          setLoading(true);
          const boardData = await getBoardById(bno);
          console.log("Received board data:", boardData);
          setBoard(boardData);
          setEditedBoard({
            title: boardData.title,
            content: boardData.content,
          });
        } catch (error) {
          console.error("Failed to load board:", error);
          setError(error.message || "게시글을 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };
  
      if (bno) {
        fetchBoardData();
      }
    }, [bno]);
  

    const handleEditToggle = () => {
      setIsEditing((prev) => !prev);
    };
    const handleEditChange = (e) => { //(제목과 내용 수정) 
      const { name, value } = e.target;
      setEditedBoard((prevBoard) => ({
        ...prevBoard,
        [name]: value,
      }));
    };
    const handleSaveEdit = () => { // (수정 내용 저장)
      if (!editedBoard.title || !editedBoard.content) {
        alert("Please enter both title and content.");
        return;
      }
    
      updateBoard(bno, editedBoard)
        .then((updatedBoard) => {
          setBoard(updatedBoard); // 수정된 게시글을 화면에 반영
          setIsEditing(false); // 수정 모드 종료
        })
        .catch((error) => alert("Failed to update board.")); // 오류 처리
    };
    
    

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">내 게시물</h2>
        {myPageData && myPageData.boards && Array.isArray(myPageData.boards) && myPageData.boards.length > 0 ? (
          <ul className="space-y-6">
            {myPageData.boards.map((board) => (
              <li key={board.bno} className="bg-gray-50 shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{board.title}</h3>
                  <p className="text-gray-600 text-base">{board.content}</p>

                  <td className="text-center">
                    
                    
                    {/* <button
                        onClick={handleEditToggle}
                        className="bg-blue-500 text-white p-2 mt-2 rounded"
                      >
                        수정
                    </button> */}
                    <button
                          onClick={() => handleDelete(board.bno)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          삭제
                    </button>
                  </td>

                  <div className="mt-4">
                    <strong className="text-gray-700">댓글:</strong>
                    {board.comments && board.comments.length > 0 ? (
                      <ul className="space-y-2 mt-2">
                        {board.comments.map((comment) => (
                          <li key={comment.cno} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                            <p className="text-gray-700">{comment.content}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 mt-2">댓글이 없습니다.</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">작성한 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
