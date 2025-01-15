import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_SERVER_HOST } from "../api/api";
import { getMemberInfo } from "../api/memberApi";
import { createOrderFromCart, createOrderFromKit } from "../api/orderApi";

const OrderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderInfo, setOrderInfo] = useState({
    receiver: "",
    receiverPhone: "",
    address: "",
    addressDetail: "",
    zipcode: "",
    message: "",
  });
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });
  const [useUserInfo, setUseUserInfo] = useState(false);

  useEffect(() => {
    if (!auth) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/members/login");
      return;
    }

    const { items, userInfo } = location.state || {};
    if (!items) {
      alert("주문 정보가 없습니다.");
      navigate(-1);
      return;
    }

    if (userInfo) {
      setOrderInfo((prev) => ({
        ...prev,
        receiver: userInfo.name || "",
        receiverPhone: userInfo.phone || "",
        zipcode: userInfo.address?.zipcode || "", // 구조 통일
        address: userInfo.address?.address || "",
        addressDetail: userInfo.address?.detailAddress || "",
      }));
      setUseUserInfo(true);
    } else {
      // userInfo가 없으면 회원 정보 가져오기
      fetchUserInfo();
    }

    setOrderItems(items);
    calculateTotalAmount(items);
  }, [auth, location.state]);

  const fetchUserInfo = async () => {
    try {
      console.log("회원 정보 가져오기 시작");
      const memberInfo = await getMemberInfo(auth.user.id);
      console.log("받아온 회원 정보:", memberInfo);

      setOrderInfo((prev) => ({
        ...prev,
        receiver: memberInfo.name || "",
        receiverPhone: memberInfo.phone || "",
        zipcode: memberInfo.address?.zipcode || "",
        address: memberInfo.address?.address || "",
        addressDetail: memberInfo.address?.detailAddress || "",
      }));
      console.log("회원 정보 설정 완료");
    } catch (error) {
      console.error("회원 정보 가져오기 실패:", error);
      alert("회원 정보를 가져오는데 실패했습니다.");
      setUseUserInfo(false);
    }
  };

  const handleUseUserInfo = () => {
    setUseUserInfo(!useUserInfo);
    if (!useUserInfo) {
      fetchUserInfo();
    } else {
      // 배송지 정보 초기화
      setOrderInfo({
        receiver: "",
        receiverPhone: "",
        address: "",
        addressDetail: "",
        zipcode: "",
        message: orderInfo.message, // 배송 메시지는 유지
      });
    }
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // 필수 정보 검증 강화
      if (!orderInfo.receiver?.trim()) {
        alert("수령인을 입력해주세요.");
        return;
      }
      if (!orderInfo.receiverPhone?.trim()) {
        alert("연락처를 입력해주세요.");
        return;
      }
      if (!orderInfo.address?.trim() || !orderInfo.zipcode?.trim()) {
        alert("주소를 입력해주세요.");
        return;
      }

      const { fromCart, fromKit } = location.state || {};
      let orderResponse;

      if (fromCart) {
        // 장바구니 주문
        orderResponse = await createOrderFromCart(auth.user.id, {
          receiver: orderInfo.receiver.trim(),
          receiverPhone: orderInfo.receiverPhone.trim(),
          address: orderInfo.address.trim(), // 변경: 객체가 아닌 문자열로 전송
          addressDetail: orderInfo.addressDetail.trim(), // 변경: 별도 필드로 전송
          zipcode: orderInfo.zipcode.trim(), // 변경: 별도 필드로 전송
          message: orderInfo.message?.trim() || "",
          totalAmount: location.state.totalAmount,
          orderItems: orderItems.map((item) => ({
            kitId: item.kitId,
            size: item.size,
            quantity: item.quantity || 1,
            basePrice: item.basePrice,
            customization: item.customization,
          })),
        });
      } else if (fromKit) {
      // 단일 상품 주문
      const item = orderItems[0]; // 단일 상품이므로 첫 번째 아이템
      orderResponse = await createOrderFromKit(auth.user.id, item.kitId, {
        receiver: orderInfo.receiver.trim(),
        receiverPhone: orderInfo.receiverPhone.trim(),
        address: orderInfo.address.trim(), // 변경: 객체가 아닌 문자열로 전송
        addressDetail: orderInfo.addressDetail.trim(), // 변경: 별도 필드로 전송
        zipcode: orderInfo.zipcode.trim(), // 변경: 별도 필드로 전송
        deliveryMessage: orderInfo.message?.trim() || "",
        totalAmount: totalAmount,
        orderItems: [
          {
            kitId: item.kitId,
            selectedSize: item.size,
            quantity: item.quantity || 1,
            basePrice: item.basePrice,
            customization: item.customization,
          },
        ],
      });
    }

      if (orderResponse?.id) {
        navigate("/payments/process", {
          state: {
            orderData: {
              orderId: orderResponse.id,
              memberId: auth.user.id,
              totalAmount,
              orderItems,
              orderInfo,
            },
          },
        });
      } else {
        throw new Error("주문 생성 실패: 주문 ID를 받지 못했습니다.");
      }
    } catch (error) {
      console.error("주문 실패:", error);
      alert(
        error.response?.data?.message || "주문 처리 중 오류가 발생했습니다."
      );
    }
  };

  // 주소 검색 핸들러 추가
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setOrderInfo((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.address,
          addressDetail: "", // 상세주소는 사용자가 직접 입력
        }));
      },
    }).open();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">주문/결제</h2>
      <div className="flex gap-8">
        {/* 왼쪽: 주문 정보 입력 폼 */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">배송 정보</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useUserInfo"
                  checked={useUserInfo}
                  onChange={handleUseUserInfo}
                  className="mr-2"
                />
                <label htmlFor="useUserInfo" className="text-sm text-gray-600">
                  회원 정보와 동일
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  수령인 *
                </label>
                <input
                  type="text"
                  name="receiver"
                  value={orderInfo.receiver}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  연락처 *
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={orderInfo.receiverPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">주소 *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="zipcode"
                    value={orderInfo.zipcode}
                    className="w-1/3 p-2 border rounded"
                    placeholder="우편번호"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  value={orderInfo.address}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="기본주소"
                  readOnly
                />
                <input
                  type="text"
                  name="addressDetail"
                  value={orderInfo.addressDetail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="상세주소를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  배송 메시지
                </label>
                <input
                  type="text"
                  name="message"
                  value={orderInfo.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="배송시 요청사항을 입력하세요"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 주문 상품 정보 및 결제 금액 */}
        <div className="w-96">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">주문 상품 정보</h3>
            <div className="space-y-4">
              {orderItems.map((item, index) => {
                const uniqueKey = item.id
                  ? `order-item-${item.id}`
                  : `order-item-${index}-${item.kitName}-${item.size}`;

                return (
                  <div key={uniqueKey} className="border-b pb-4">
                    <div className="flex gap-4">
                      <img
                        src={`${API_SERVER_HOST}/${item.imgUrl}`}
                        alt={item.kitName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{item.kitName}</h4>
                        <p className="text-sm text-gray-600">
                          사이즈: {item.size}
                        </p>
                        {item.customization && (
                          <div className="text-sm text-gray-600">
                            {item.customization.patch && (
                              <p key={`${uniqueKey}-patch`}>
                                패치: {item.customization.patchType}
                              </p>
                            )}
                            {item.customization.customName && (
                              <p key={`${uniqueKey}-name`}>
                                이름: {item.customization.customName}
                              </p>
                            )}
                            {item.customization.customNumber && (
                              <p key={`${uniqueKey}-number`}>
                                번호: {item.customization.customNumber}
                              </p>
                            )}
                            {item.customization.playerName && (
                              <p key={`${uniqueKey}-player-name`}>
                                이름: {item.customization.playerName}
                              </p>
                            )}
                            {item.customization.playerNumber && (
                              <p key={`${uniqueKey}-player-number`}>
                                번호: {item.customization.playerNumber}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="font-semibold mt-1">
                          ₩{item.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span>상품 금액</span>
                <span>₩{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>총 결제금액</span>
                <span>₩{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
