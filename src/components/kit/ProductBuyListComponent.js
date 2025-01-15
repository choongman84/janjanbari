import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { checkWishlist, addWishlist, removeWishlist } from "../api/wishlistApi";
import jwtAxios from "../../util/jwtUtil";
import { useNavigate } from "react-router-dom";

const ProductBuyListComponent = () => {
  const [kits, setKits] = useState([]);
  const [wishlistMap, setWishlistMap] = useState(new Map());
  const navigate = useNavigate();
  const [auth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      const response = await jwtAxios.get(`http://localhost:8080/api/kits/list`);
      setKits(response.data);
      if (auth?.user?.id) {
        response.data.forEach(async (kit) => {
          const isWishlisted = await checkWishlist(auth.user.id, kit.id);
          setWishlistMap(prev => new Map(prev).set(kit.id, isWishlisted));
        });
      }
    } catch (error) {
      console.error("Error fetching kits:", error);
    }
  };

  const handleWishlistToggle = async (e, kitId) => {
    e.stopPropagation();
    if (!auth?.user?.id) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    try {
      const isCurrentlyWishlisted = wishlistMap.get(kitId);
      if (isCurrentlyWishlisted) {
        await removeWishlist(auth.user.id, kitId);
      } else {
        await addWishlist(auth.user.id, kitId);
      }
      setWishlistMap(prev => new Map(prev).set(kitId, !isCurrentlyWishlisted));
    } catch (error) {
      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/members/login");
      } else {
        console.error("위시리스트 처리 실패:", error);
        alert(error.message);
      }
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        레알마드리드 유니폼
      </Typography>
      <Grid container spacing={3}>
        {kits.map((kit) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={kit.id}>
            <Card style={{ position: 'relative' }}>
              <IconButton
                onClick={(e) => handleWishlistToggle(e, kit.id)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 1,
                  color: wishlistMap.get(kit.id) ? 'red' : 'grey'
                }}
              >
                {wishlistMap.get(kit.id) ? <FaHeart /> : <FaRegHeart />}
              </IconButton>
              <div onClick={() => navigate(`/kits/detail/${kit.id}`)} style={{ cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={kit.images.length > 0
                    ? `http://localhost:8080/${kit.images[0]}`
                    : "https://via.placeholder.com/200"}
                  alt={kit.name}
                />
                <CardContent>
                  <Typography variant="h6">{kit.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {kit.description || "No description available."}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {formatPrice(kit.price)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    남은 재고 수량 {kit.stock}
                  </Typography>
                </CardContent>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductBuyListComponent;
