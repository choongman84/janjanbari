import { motion } from "framer-motion";  // framer-motion에서 애니메이션 효과를 가져옵니다.
import { Link , useNavigate} from "react-router-dom";  // 페이지 간 링크를 위한 Link 컴포넌트를 가져옵니다.
import {fetchMyPageList} from "../../components/api/memberApi";
import { useState, useEffect } from 'react'; // React에서 상태와 효과를 관리하는 hook을 가져옵니다.
import { Outlet } from 'react-router-dom';

const MyPageList = () => {
  const [myPageData, setMyPageData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("auth");
 
  // console.log("티켓 목록의 사용자 : ", JSON.parse(storedUser));
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  console.log("ticket add parsetUser:", parsedUser);
  const { user } = parsedUser;
  console.log("user:", user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          alert("Member ID is missing. Please log in again.");
          navigate("/members/login");
          return;
        }

        const data = await fetchMyPageList(user.id); // Pass memberId
        setMyPageData(data);
      } catch (err) {
        console.error("Error fetching MyPage data:", err);
        setError("Failed to load MyPage data. Please try again.");
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/");
    window.location.reload();
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!myPageData) {
    return <div>Loading...</div>;
  }

 

  return (
    <div>
      <div className="min-h-[60vh] bg-[#0a0f2c] text-white">
        {/* 메인 섹션 */}
        <div className="flex justify-between items-start p-8 mx-40">
          {/* 왼쪽 콘텐츠: 사용자 이메일과 프로필 정보 */}
          <div className="flex-1">
            <p>
              <strong>Name:</strong>{myPageData.member.name}
            </p>
             <p>
             <strong>email:</strong>{myPageData.member.email}
            </p> 
            <h1 className="text-5xl font-bold mt-4 leading-tight">
              이곳은 당신의<br />
              마드리디스타<br />
              지역입니다
            </h1>
            <div className="flex gap-4 mt-8">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors">
                ⚙️ 귀하의 프로필
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(75,80,230)] hover:bg-[#3A3FB3] transition-colors">
                🏆 프리미엄으로 이동
              </button>
            </div>
          </div>
      
        <div>
          <div className="flex justify-end mr-11   space-x-6">
              <Link to="/notifications" className="text-white hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>
              <Link to="/settings" className="text-white hover:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>

          {/* Right Card */}
          
              <div className="Card relative m-9">
                <img
                  src="https://assets.realmadrid.com/is/image/realmadrid/free?$Desktop$&wid=478"
                  className="w-full h-full object-cover"
                />
                <div className="card_content absolute inset-2 bg-black/30 flex flex-col justify-end p-4">
                  <div className="content_text text-white">
                    <p translate="profile.home.herocard.carnet.text">
                      <div style={{"vertical-align": "inherit"}}>마드리스타 이후</div>
                    </p>
                    <p className="content_date mt-2">
                      <div style={{"vertical-align": "inherit"}}>2024년 11월 28일</div>
                    </p>
                  </div>
                </div>

                <div className="absolute mt-4 right-0 text-white">
                  + 월렛에 카드 추가
                </div>
              </div>
            
        </div>

        </div>
      </div>
      
      <div className="space-y-6 max-h-screen mx-40 my-10">
       
        {/* 최근 예매 내역 Section */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">티켓 최근 예매 내역</h3>
              
              <Link
                to="/ticket/list"
                className="text-sm text-blue-500 hover:underline"
              >
                더보기
              </Link>
            </div>
    
            {/* 예매 내역 그리드 */}
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">예매일</th>
                      <th className="px-4 py-2 text-left">예약번호</th>
                      <th className="px-4 py-2 text-left">공연명</th>
                      <th className="px-4 py-2 text-left">관람일</th>
                      <th className="px-4 py-2 text-left">매수</th>
                      <th className="px-4 py-2 text-left">취소가능일</th>
                      <th className="px-4 py-2 text-left">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 예매 내역이 없을 경우 */}
                    <tr>
                      <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                        최근 예매 내역이 없습니다.
                      </td>
                    </tr>
                    
                    <tr>
                      {/* <td className="px-4 py-2">2024-11-21</td>
                      <td className="px-4 py-2">123456789</td>
                      <td className="px-4 py-2">뮤지컬 공연</td>
                      <td className="px-4 py-2">2024-12-01</td>
                      <td className="px-4 py-2">2</td>
                      <td className="px-4 py-2">2024-11-28</td>
                      <td className="px-4 py-2">예약 완료</td> */}
                    </tr>
    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    
        {/* Second section of cards */}
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: "Order",
                description: "주문내역 조회",
                detail: "고객님께서 주문하신 상품의 주문내역을 확인하실 수 있습니다.",
                href: "/members/order",
              },
              {
                title: "Restore",
                description: "취소/반품/교환",
                detail: "고객님의 주문하신 상품의 취소/반품/교환 내역을 확인하실 수 있습니다.",
                href: "/members/restore",
              },
              {
                title: "WishList",
                description: "위시리스트 관리",
                detail: "고객님께서 찜하신 상품 조회하는 공간입니다.",
                href: "/members/wishlist",
              },
              {
                title: "Boards",
                description: "게시물 관리",
                detail: "고객님께서 작성하신 게시물을 관리하는 공간입니다.",
                href: "/members/boards",
              },
              {
                title: "Comments",
                description: "게시물 댓글 관리",
                detail: "고객님께서 작성하신 게시물의 댓글을 관리하는 공간입니다.",
                href: "/members/comments",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to={item.href} className="block h-full">
                  <div className="p-4 bg-white shadow-md rounded-lg h-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{item.detail}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
          onClick={handleLogout}  // 로그아웃 버튼 클릭 시 handleLogout 함수 호출
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout  {/* 로그아웃 버튼 텍스트 */}
        </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPageList;

