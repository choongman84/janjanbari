// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { getList, searchBoard } from "../../components/api/boardApi";
// import Pagination from "react-bootstrap/Pagination";

// const BoardPage = () => {
//   const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [searchType, setSearchType] = useState("title");
//   const [boards, setBoards] = useState([]);
//   const [keyword, setKeyword] = useState("");
//   const [page, setPage] = useState(1); // `page` 상태 추가
//   const [size, setSize] = useState(10); // 한 페이지당 게시글 수 (필요시 조정)
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//     fetchBoards();
//   }, [page, size]);

//   const fetchBoards = async () => {
//     try {
//       const data = await getList(page, size);
//       setBoards(data.dtoList);
//       setTotalPages(data.totalPages);  // 전체 페이지 수 설정
//     } catch (error) {
//       console.error("게시글 목록 불러오기 실패:", error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const data = await searchBoard(page, size, searchType, keyword);
//       setBoards(data.dtoList);
//     } catch (error) {
//       console.error("검색 실패:", error);
//       alert("검색에 실패했습니다.");
//     }
//   };

//   const handleDelete = async (bno) => {
//     if (!isLoggedIn) {
//       alert("로그인 후 삭제할 수 있습니다.");
//       return;
//     }
//     // 삭제 로직 추가
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="flex flex-col items-center justify-center space-y-4 p-10">
//         <h2 className="text-xl font-semibold">로그인 후 이용 가능합니다.</h2>
//         <button
//           onClick={() => navigate("/login")}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           로그인 페이지로 이동
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex flex-col items-center text-center font-bold space-y-4 mb-10">
//         <h1 className="text-2xl md:text-3xl">축구 게시판</h1>
//         <h2 className="text-lg md:text-xl"></h2>
//       </div>

//       <div className="p-4 w-[1300px] mx-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold">게시글 목록</h2>

//           <div className="flex items-center space-x-2">
//             <select
//               value={searchType}
//               onChange={(e) => setSearchType(e.target.value)}
//               className="border border-gray-300 p-2 rounded"
//             >
//               <option value="title">제목</option>
//               <option value="content">내용</option>
//               <option value="writer">작성자</option>
//             </select>
//             <input
//               type="text"
//               placeholder="검색어를 입력하세요."
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               className="border border-gray-300 p-2 rounded w-64"
//             />
//             <button
//               onClick={handleSearch}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               검색
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-gray-300 border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2 w-16 text-center">순번</th>
//                 <th className="border p-2 w-24 text-center">작성자</th>
//                 <th className="border p-2 text-center">제목</th>
//                 <th className="border p-2 w-24 text-center">조회수</th>
//                 <th className="border p-2 w-24 text-center">등록일</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(boards || []).map((board) => (
//                 <tr key={board.bno} className="hover:bg-gray-50">
//                   <td className="border p-2 text-center">{board.bno}</td>
//                   <td className="border p-2 text-center">{board.writer}</td>
//                   <td className="border p-2">
//                     <Link
//                       to={`/board/${board.bno}`}
//                       className="text-blue-500 hover:underline"
//                     >
//                       {board.title}
//                     </Link>
//                   </td>
//                   <td className="border p-2 text-center">{board.views}</td>
//                   <td className="border p-2 text-center">
//                     {new Date(board.createdDate).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="flex justify-end mt-4">
//             <Link
//               to="/board/add"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               새 게시글 작성
//             </Link>
//           </div>
//         </div>

//         <Pagination className="mt-4 justify-center">
//           <Pagination.First onClick={() => setPage(1)} />
//           <Pagination.Prev
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//           />
//           {[...Array(totalPages)].map((_, idx) => (
//             <Pagination.Item
//               key={idx + 1}
//               active={idx + 1 === page}
//               onClick={() => setPage(idx + 1)}
//             >
//               {idx + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next
//             onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={page === totalPages}
//           />
//           <Pagination.Last onClick={() => setPage(totalPages)} />
//         </Pagination>
//       </div>
//     </>
//   );
// };

// export default BoardPage;
