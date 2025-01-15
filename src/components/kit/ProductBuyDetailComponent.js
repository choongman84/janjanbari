import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getKitDetail,
  getCustomizationOptions,
  addToCart,
} from "../api/kitApi";
import jwtAxios from "../../util/jwtUtil";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { createOrderFromKit } from "../api/orderApi";

const ProductBuyDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  const [kit, setKit] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPatch, setSelectedPatch] = useState({
    type: "none",
    price: 0,
  });
  const [customization, setCustomization] = useState({
    type: "none",
    playerOption: "",
    customName: "",
    customNumber: "",
    price: 0,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [customizationOptions, setCustomizationOptions] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kitData, options] = await Promise.all([
          getKitDetail(id),
          getCustomizationOptions(id),
        ]);
        console.log("Kit Data:", kitData); // 데이터 확인용 로그
        console.log("Kit Images:", kitData.images); // 이미지 URL 확인용 로그
        setKit(kitData);
        setCustomizationOptions(options);
        setTotalPrice(kitData.price);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kitData, options] = await Promise.all([
          getKitDetail(id),
          getCustomizationOptions(id),
        ]);
        setKit(kitData);
        setTotalPrice(kitData.price);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (kit) {
      calculateTotalPrice();
    }
  }, [kit, selectedPatch, customization]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handlePatchSelect = (type, price) => {
    setSelectedPatch({ type, price });
  };

  const handleCustomizationSelect = (type) => {
    if (customization.type === "custom" && type === "player") {
      setCustomization({
        type: "player",
        playerOption: "",
        playerName: "",
        playerNumber: "",
        price: 28000,
      });
    } else if (customization.type === "player" && type === "custom") {
      setCustomization({
        type: "custom",
        playerOption: "",
        customName: "",
        customNumber: "",
        price: 28000,
      });
    } else if (type === "none") {
      setCustomization({
        type: "none",
        playerOption: "",
        customName: "",
        customNumber: "",
        price: 0,
      });
    } else {
      setCustomization({
        ...customization,
        type,
        price: type === "none" ? 0 : 28000,
      });
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = kit?.price || 0;
    const patchPrice = selectedPatch.type !== "none" ? selectedPatch.price : 0;
    const customizationPrice =
      customization.type !== "none" ? customization.price : 0;
    setTotalPrice(basePrice + patchPrice + customizationPrice);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    const memberId = auth.user?.id;
    if (!memberId) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const cartItem = {
      kitId: kit.id,
      quantity: 1,
      size: selectedSize,
      basePrice: kit.price,
      recipientName: auth.user.name,
      recipientPhone: auth.user.phone || "",
      recipientAddress: auth.user.address || "",
      recipientEmail: auth.user.email || "",
      customization: {
        type: customization.type,
        patch: selectedPatch.type !== "none",
        patchType: selectedPatch.type !== "none" ? selectedPatch.type : null,
        hasPlayerName: customization.type !== "none",
        playerName:
          customization.type === "player" ? customization.customName : null,
        playerNumber:
          customization.type === "player" ? customization.customNumber : null,
        customName:
          customization.type === "custom" ? customization.customName : null,
        customNumber:
          customization.type === "custom" ? customization.customNumber : null,
        totalCustomPrice: customization.type !== "none" ? 28000 : 0,
      },
    };

    try {
      await addToCart(memberId, cartItem);
      console.log("장바구니에 상품 추가");
      alert("장바구니에 추가되었습니다.");
      navigate("/cart");
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요하거나 세션이 만료되었습니다.");
        navigate("/members/login");
      } else {
        alert("장바구니 추가에 실패했습니다.");
      }
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    const memberId = auth.user?.id;
    if (!memberId) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const orderItem = {
      kitId: kit.id,
      kitName: kit.name,
      imgUrl: kit.images[0],
      quantity: 1,
      size: selectedSize,
      basePrice: kit.price,
      totalPrice: totalPrice,
      customization: {
        type: customization.type,
        patch: selectedPatch.type !== "none",
        patchType: selectedPatch.type !== "none" ? selectedPatch.type : null,
        hasPlayerName: customization.type !== "none",
        playerName: customization.type === "player" ? customization.customName : null,
        playerNumber: customization.type === "player" ? customization.customNumber : null,
        customName: customization.type === "custom" ? customization.customName : null,
        customNumber: customization.type === "custom" ? customization.customNumber : null,
        totalCustomPrice: customization.type !== "none" ? 28000 : 0,
      }
    };

    navigate(`/orders/${memberId}`, { 
      state: { 
        fromKit: true,
        items: [orderItem],
        userInfo: auth.user
      } 
    });
  };

  const getGalleryItems = (images) => {
    if (!images || images.length === 0) return [];

    return images.map((image) => ({
      original: `http://localhost:8080/${image}`,
      thumbnail: `http://localhost:8080/${image}`,
      originalHeight: "400px",
      thumbnailHeight: "60px",
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          {kit?.images && kit.images.length > 0 && (
            <ImageGallery
              items={getGalleryItems(kit.images)}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={true}
              thumbnailPosition="bottom"
              useBrowserFullscreen={false}
              additionalClass="custom-image-gallery"
            />
          )}
        </div>

        <div className="product-info space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{kit?.name}</h1>
            <p className="text-xl font-semibold mt-2">
              ₩{totalPrice?.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">사이즈</p>
            <div className="flex gap-2">
              {kit?.sizes?.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">시즌 패치 </p>
            <div className="flex flex-col gap-2">
              <button
                className={`p-3 border rounded-md flex justify-between items-center ${
                  selectedPatch.type === "UCL" ? "border-blue-600" : ""
                }`}
                onClick={() => handlePatchSelect("UCL", 21000)}
              >
                <span>Champions League Pack</span>
                <span>+₩21,000</span>
              </button>
              <button
                className={`p-3 border rounded-md flex justify-between items-center ${
                  selectedPatch.type === "LALIGA" ? "border-blue-600" : ""
                }`}
                onClick={() => handlePatchSelect("LALIGA", 21000)}
              >
                <span>La Liga Pack</span>
                <span>+₩21,000</span>
              </button>
              <button
                className={`p-3 border rounded-md flex justify-between items-center ${
                  selectedPatch.type === "CWCUP" ? "border-blue-600" : ""
                }`}
                onClick={() => handlePatchSelect("CWCUP", 21000)}
              >
                <span>FIFA Club World Cup</span>
                <span>+₩21,000</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">이름 및 번호:</p>
            <div className="space-y-3">
              <button
                className={`w-full p-3 border rounded-md text-left ${
                  customization.type === "none" ? "border-blue-600" : ""
                }`}
                onClick={() => handleCustomizationSelect("none")}
              >
                없음
              </button>

              <button
                className={`w-full p-3 border rounded-md text-left ${
                  customization.type === "player" ? "border-blue-600" : ""
                }`}
                onClick={() => handleCustomizationSelect("player")}
              >
                선수 선택 (+₩28,000)
              </button>

              <button
                className={`w-full p-3 border rounded-md text-left ${
                  customization.type === "custom" ? "border-blue-600" : ""
                }`}
                onClick={() => handleCustomizationSelect("custom")}
              >
                주문 제작 (+₩28,000)
              </button>

              {customization.type === "player" && (
                <div className="space-y-2">
                  <select
                    className="w-full p-3 border rounded-md"
                    value={customization.playerOption}
                    onChange={(e) => {
                      const selectedPlayer =
                        customizationOptions?.availablePlayers?.find(
                          (p) => p.id === parseInt(e.target.value)
                        );

                      if (selectedPlayer) {
                        setCustomization({
                          ...customization,
                          type: "player",
                          playerOption: e.target.value,
                          customName: selectedPlayer.name,
                          customNumber: selectedPlayer.number,
                          price: 28000,
                        });
                      }
                    }}
                  >
                    <option value="">선수를 선택하세요</option>
                    {customizationOptions?.availablePlayers?.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.number} - {player.name}
                      </option>
                    ))}
                  </select>

                  {customization.customName && customization.customNumber && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p>선택된 선수: {customization.customName}</p>
                      <p>등번호: {customization.customNumber}</p>
                    </div>
                  )}
                </div>
              )}

              {customization.type === "custom" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="이름 입력"
                    className="w-full p-3 border rounded-md"
                    value={customization.customName}
                    onChange={(e) => {
                      setCustomization({
                        ...customization,
                        customName: e.target.value,
                      });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="번호 입력 (1-99)"
                    className="w-full p-3 border rounded-md"
                    value={customization.customNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      if (
                        value === "" ||
                        (Number(value) >= 1 && Number(value) <= 99)
                      ) {
                        setCustomization({
                          ...customization,
                          customNumber: value,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700"
          >
            장바구니에 담기
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full bg-green-600 text-white py-4 rounded-md hover:bg-green-700 mt-2"
          >
            즉시 구매
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductBuyDetailComponent;
