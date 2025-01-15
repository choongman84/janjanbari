import React, { useEffect, useState } from "react";
import { getList, deleteBoard, searchBoard } from "../api/boardApi";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react"; 
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';



const BoardListComponent = ({ token }) => {
  const [boardList, setBoardList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  
  useEffect(() => {
    console.log("board.createDate:", boardList.map(board => board.createDate));
  }, [boardList]);
  
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
    console.log("boardList:", boardList);
  }, [boardList]);

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

// 날짜 포맷팅 함수
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
    <div className="flex flex-col min-h-screen">
      {/* <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="h-20 w-20">
            <img 
              src="https://scsgozneamae10236445.cdn.ntruss.com/data2/content/image/2019/01/24/.cache/512/201901240837397.jpg" 
              alt="logo" 
            />
          </Link>
        </nav>
      </header> */}

      <div className="relative h-[350px] overflow-hidden">
        <img
          src="https://image.fmkorea.com/files/attach/new/20180421/486616/169549519/1025955244/1bcf21db1ca5d0316401514ee066e533.jpg"
          alt="Banner background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Soccer Gallery</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1 w-[1300px]">
        <div className="container ml-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={"/"}>
              <Home className="w-4 h-4" />
            </Link> 
            <ChevronRight className="ml w-4 h-4" />
            <span>축구 갤러리</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="writer">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 p-2 rounded w-64"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            검색
          </button>
        </div>

        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table striped bordered hover className="w-full border-gray-300">
            <thead>
              <tr>
                <th className="text-center" style={{ width: '100px' }}>번호</th>
                <th className="text-center" style={{ width: '100px' }}>구분</th>
                <th>제목</th>
                <th className="text-center" style={{ width: '100px' }}>작성자</th>
                <th className="text-center" style={{ width: '150px' }}>작성일</th>
                <th className="text-center" style={{ width: '80px' }}>조회수</th>
                {/* <th className="text-center" style={{ width: '100px' }}>삭제</th> */}
              </tr>
            </thead>
            <tbody>
              {boardList.length > 0 ? (
                boardList.map((board) => (
                  <tr key={board.bno}>
                    <td className="text-center">{board.bno}</td>
                    <td className="text-center">자유글</td>
                    <td>
                      <Link to={`/board/${board.bno}`} className="hover:underline">
                        {board.title}
                      </Link>
                    </td>
                    <td className="text-center">{board.writer}</td>

                    <td className="text-center">
                      {board.createDate ? formatDate(board.createDate) : "-"}
                    </td>

                    
                    <td className="text-center">{board.views || 0}</td>
                    <td className="text-center">
                      {/* <button
                        onClick={() => handleDelete(board.bno)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Link
            to="/board/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            새 게시글 작성
          </Link>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="px-3 py-1">{page}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BoardListComponent;
