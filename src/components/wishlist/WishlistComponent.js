import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeWishlist } from "../api/wishlistApi";
import { API_SERVER_HOST } from "../api/api";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";

const WishlistComponent = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    if (!auth?.user?.id) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }
    fetchWishlist();
  }, [auth, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist(auth.user.id);
      setWishlistItems(data);
    } catch (error) {
      console.error("위시리스트 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/members/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (kitId) => {
    try {
      await removeWishlist(auth.user.id, kitId);
      await fetchWishlist();
    } catch (error) {
      console.error("위시리스트 제거 실패:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Typography variant="h4" gutterBottom>
        내 위시리스트
      </Typography>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="body1">위시리스트가 비어있습니다.</Typography>
          <button
            onClick={() => navigate("/kits")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card>
                <IconButton
                  onClick={() => handleRemoveFromWishlist(item.kitId)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    zIndex: 1,
                  }}
                >
                  <FaTrash />
                </IconButton>
                <div
                  onClick={() => navigate(`/kits/detail/${item.kitId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${API_SERVER_HOST}/${item.imageUrl}`}
                    alt={item.kitName}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.kitName}</Typography>
                    <Typography variant="body1">
                      {item.price?.toLocaleString()}원
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.kitType} / {item.gender}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default WishlistComponent;
