import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { API_SERVER_HOST } from "../api/api";

const CartListComponent = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  useEffect(() => {
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }
    fetchCartItems();
  }, [auth]);

  const fetchCartItems = async () => {
    try {
      const cartData = await getCart(auth.user.id);
      console.log("장바구니 데이터", cartData);
      if (cartData && cartData.cartItems) {
        setCartItems(cartData.cartItems);
        setTotalPrice(cartData.totalAmount || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/members/login");
      }
    }
  };

  const handleOrder = () => {
    const formattedItems = cartItems.map(item => ({
      kitId: item.kitId,
      kitName: item.kitName,
      imgUrl: item.imgUrl,
      size: item.size,
      quantity: item.quantity,
      basePrice: item.basePrice,
      totalPrice: item.totalPrice,
      customization: item.customization
    }));

    navigate(`/orders/${auth.user.id}`, {
      state: {
        fromCart: true,
        items: formattedItems,
        totalAmount: totalPrice,
        userInfo: auth.user
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p>장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate("/kits")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            쇼핑 계속하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`${API_SERVER_HOST}/${item.imgUrl}`}
                  alt={item.kitName}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.kitName}</h3>
                  <p>사이즈: {item.size}</p>
                  {item.customization && (
                    <>
                      {item.customization.patch && (
                        <p>패치: {item.customization.patchType}</p>
                      )}
                      {item.customization.customName && (
                        <p>이름: {item.customization.customName}</p>
                      )}
                      {item.customization.customNumber && (
                        <p>번호: {item.customization.customNumber}</p>
                      )}
                      {item.customization.playerName && (
                        <p>이름: {item.customization.playerName}</p>
                      )}
                      {item.customization.playerNumber && (
                        <p>번호: {item.customization.playerNumber}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₩{item.totalPrice.toLocaleString()}
                </p>
                <p>수량: {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              총 금액: ₩{totalPrice.toLocaleString()}
            </p>
            <button
              onClick={handleOrder}
              className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartListComponent;
