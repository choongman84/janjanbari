import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import { fetchMyPageList } from '../../components/api/memberApi';  

const CommentsPage = () => {
  const [myPageData, setMyPageData] = useState(null);  
  const [error, setError] = useState("");  
  const navigate = useNavigate();  

  const storedUser = localStorage.getItem("auth");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const { user } = parsedUser || {};  // Handle missing user safely

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          alert("Member ID is missing. Please log in again.");
          navigate("/members/login");
          return;
        }

        const data = await fetchMyPageList(user.id);  
        setMyPageData(data);  
      } catch (err) {
        console.error("Error fetching MyPage data:", err);
        setError("Failed to load MyPage data. Please try again.");
      }
    };

    fetchData();  
    
  }, [navigate, user]);  

  // Check if myPageData is valid and contains comments
  const hasComments = myPageData && Array.isArray(myPageData.comments) && myPageData.comments.length > 0;

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">My Boards</h2>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          뒤로 가기
        </button>
      </div>
      
      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Comments</h3>

        {/* Error Handling */}
        {error && <p className="text-red-500 mb-4">{error}</p>}  

        {/* Display Comments if they exist */}
        {hasComments ? (
          <ul className="space-y-4">
            {myPageData.comments.map((comment) => (
              <li key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-lg">{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No comments found.</p> 
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
