import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById, updateBoard } from "../api/boardApi";
import { getCommentList, addComment, updateComment, deleteComment } from "../api/commentApi";
import { formatDate } from "../../data/data";


const BoardDetailComponent = () => {
  const { bno } = useParams();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("auth");
  console.log("게시글 세부: ", JSON.parse(storedUser));
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const [accessToken, setAccessToken] = useState(parsedUser.accessToken)
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState({
    content: "",
    memberId: parsedUser?.id || null,
  });
  const [commentList, setCommentList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBoard, setEditedBoard] = useState({ title: "", content: "" });
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

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

  useEffect(() => {
    const fetchComments = async (bno) => {
      try {
        console.log("Fetching comments for board:", bno);
        const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
        if (bno) {
          const comments = await getCommentList(bno); // Pass the token
          console.log("Received comments:", comments);
          setCommentList(Array.isArray(comments) ? comments : []);
          console.log("Updated comment list state:", commentList);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          request: error.request,
        });
        setCommentList([]);
      }
    };

    fetchComments(bno);
  }, [bno]);

  if (loading) {
    return <div className="p-4">Loading board details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!board) {
    return <div className="p-4">Board not found</div>;
  }

  const handleCommentChange = (e) => {
    setComment((prevComment) => ({
      ...prevComment,
      content: e.target.value,
    }));
  };

  const handleAddComment = async () => {
    if (!comment.content) {
      alert("Please enter comment content.");
      return;
    }

    // const auth = localStorage.getItem("auth"); // Retrieve the token

    if (!accessToken) {
      alert("You must log in to add a comment.");
      return;
    }
    console.log("parsedUser 100)", parsedUser);
    if (!parsedUser) {
      alert("You must log in to add a comment.");
      return;
    }

    const commentData = {
      memberId: parsedUser.user.id,
      content: comment.content,
      boardId: bno,
    };

    try {
      // Call the addComment API with the comment data
      await addComment(bno, commentData);

      // Clear the comment input field
      setComment((prevComment) => ({ ...prevComment, content: "" }));

      // Fetch the updated list of comments
      const comments = await getCommentList(bno);
      console.log("댓글", comments);
      setCommentList(Array.isArray(comments) ? comments : []);
    } catch (error) {
      console.error("Failed to add comment:", error);

      // Show an error alert with a detailed message if available
      alert(error.response?.data?.message || "Failed to add comment.");
    }
  };



  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedBoard((prevBoard) => ({
      ...prevBoard,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!editedBoard.title || !editedBoard.content) {
      alert("Please enter both title and content.");
      return;
    }

    updateBoard(bno, editedBoard)
      .then((updatedBoard) => {
        setBoard(updatedBoard);
        setIsEditing(false);
      })
      .catch((error) => alert("Failed to update board."));
  };

  const openCommentModal = (comment) => {
    setSelectedComment(comment);
    setIsCommentModalOpen(true);
  };

  const handleCommentModalChange = (e) => {
    setSelectedComment((prevComment) => ({
      ...prevComment,
      content: e.target.value,
    }));
  };

  const handleSaveCommentEdit = () => {
    updateComment(selectedComment.cno, selectedComment)
      .then(() => {
        setIsCommentModalOpen(false);
        return getCommentList(bno);
      })
      .then((comments) => {
        setCommentList(Array.isArray(comments) ? comments : []);
      })
      .catch((error) => alert("Failed to update comment."));
  };

  const handleDeleteComment = (cno) => {
    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    deleteComment(cno)
      .then(() => getCommentList(bno))
      .then((comments) => {
        setCommentList(Array.isArray(comments) ? comments : []);
      })
      .catch((error) => alert("Failed to delete comment."));
  };

  const formatDate = (dateArray, timeZone = "Asia/Seoul") => {
    if (!dateArray || !Array.isArray(dateArray)) return "-"; // 배열이 아닌 경우 기본값 반환
    
    // 배열로 전달된 값을 Date 객체로 변환 (월 처리: -1 필요)
    const [year, month, day, hours, minutes, seconds] = dateArray;
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    
    if (isNaN(date.getTime())) return "-"; // 유효하지 않은 날짜 처리
    
    // 타임존 설정하여 포맷팅
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone, // 지정된 타임존 사용
    }).format(date);
  };
  
  
  


  return (
    <div className="container mx-auto max-w-3xl py-6 space-y-8">
    {/* Post Content */}
    {board && (
      <div className="border rounded-sm">
        <div className="grid grid-cols-[1fr,3fr,1fr,1fr] border-b">
          <div className="bg-gray-50 p-3 border-r">글 유형</div>
          <div className="p-3 border-r">일반</div>
          <div className="bg-gray-50 p-3 border-r">등록일</div>
          <div className="p-3">{formatDate(board.createdDate || board.createDate)}</div>
        </div>
        <div className="grid grid-cols-[1fr,3fr,1fr,1fr] border-b">
          <div className="bg-gray-50 p-3 border-r">제목</div>
          <div className="p-3 border-r">{isEditing ? (
            <input
              name="title"
              value={editedBoard.title}
              onChange={handleEditChange}
              className="border p-2 w-full"
            />
          ) : (
            board.title
          )}</div>
          <div className="bg-gray-50 p-3 border-r">조회</div>
          <div className="p-3">{board.views}</div>
        </div>
        <div className="grid grid-cols-[1fr,11fr] border-b">
          <div className="bg-gray-50 p-3 border-r">이름</div>
          <div className="p-3">{board.writer}</div>
        </div>
        <div className="grid grid-cols-[1fr,11fr]">
          <div className="bg-gray-50 p-3 border-r">내용</div>
          <div className="p-3">
            {isEditing ? (
              <textarea
                name="content"
                value={editedBoard.content}
                onChange={handleEditChange}
                rows="4"
                className="border p-2 w-full"
              />
            ) : (
              board.content
            )}
          </div>
        </div>
      </div>
    )}
  
    {/* Action Buttons */}
    <div className="flex gap-2">
      {isEditing ? (
        <>
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white p-2 mt-2 rounded"
          >
            Save
          </button>
          <button
            onClick={handleEditToggle}
            className="bg-gray-500 text-white p-2 mt-2 ml-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white p-2 mt-2 rounded"
          >
            수정
          </button>
          <button
            onClick={() => navigate('/board/list')}
            className="bg-gray-500 text-white p-2 mt-2 ml-2 rounded"
          >
            목록으로
          </button>
        </>
      )}
    </div>
  
    {/* Comments Section */}
    <div className="border p-4 rounded-lg shadow-lg">
  <div className="text-lg font-semibold">댓글</div>
  <div className="space-y-4">
    {/* Comment Input */}
    <div className="space-y-2">
      <textarea
        value={comment.content}
        onChange={handleCommentChange}
        placeholder="댓글을 입력하세요"
        rows="4"
        className="border w-full p-2"
      />
      <div className="flex justify-end">
        <button
          onClick={handleAddComment}
          className="bg-blue-400 p-2 mt-2"
        >
          댓글 작성
        </button>
      </div>
    </div>

    {/* Comments List */}
      <div className="space-y-4">
        {commentList && commentList.length > 0 ? (
          commentList.map((comment) => (
            <div key={comment.cno || comment.id} className="border p-2 mb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{comment.authorName}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => openCommentModal(comment)}
                    className="bg-blue-400 text-white px-3 py-1 rounded mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.cno)}
                    className="bg-blue-400 text-red-500 px-3 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  </div>

  
    {/* Comment Edit Modal */}
    {isCommentModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg w-1/3">
          <h3 className="text-lg font-bold mb-2">댓글 수정</h3>
          <textarea
            value={selectedComment.content}
            onChange={handleCommentModalChange}
            rows="4"
            className="border w-full p-2 mb-4"
          />
          <button
            onClick={handleSaveCommentEdit}
            className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsCommentModalOpen(false)}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default BoardDetailComponent;
