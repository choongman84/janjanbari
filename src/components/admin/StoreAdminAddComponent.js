import React, { useState, useEffect } from "react";
import jwtAxios from "../../util/jwtUtil";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Paper,
    Typography,
    Box,
    Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StoreAdminAddComponent = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    season: "",
    kitType: "",
    gender: "",
    sizes: "",
    stock: 0,
    images: [], // 이미지 파일 저장
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      console.error("No files selected");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: selectedFiles,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth?.accessToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "/members/login";
      return;
    }

    try {
      // Step 1: Kit 데이터 전송
      const kitResponse = await jwtAxios.post(
        "http://localhost:8080/api/admin/kits/kit-data",
        {
          name: formData.name || "Default Name",
          description: formData.description || "Default Description",
          price: formData.price || 0,
          season: formData.season || "Default Season",
          kitType: formData.kitType || "HOME",
          gender: formData.gender || "MEN",
          sizes: formData.sizes.split(",").map((size) => size.trim()),
          stock: formData.stock || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      const { id: kitId } = kitResponse.data;

      // Step 2: 이미지 파일 전송
      if (formData.images.length > 0) {
        const formDataToSend = new FormData();
        formData.images.forEach((file) => {
          formDataToSend.append("images", file);
        });

        await jwtAxios.post(
          `http://localhost:8080/api/admin/kits/kit-images?kitId=${kitId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("상품이 성공적으로 등록되었습니다!");
      // 폼 초기화
      setFormData({
        name: "",
        description: "",
        price: 0,
        season: "",
        kitType: "",
        gender: "",
        sizes: "",
        stock: 0,
        images: [],
      });
      navigate("/kits")
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("member");
        window.location.href = "/members/login";
        return;
      }
      alert("상품 등록에 실패했습니다.");
    }
  };

  // 카테고리 정보 추가
  const categories = {
    MEN: {
      title: "남성",
      types: ["HOME", "AWAY", "THIRD", "GOALKEEPER_HOME", "GOALKEEPER_AWAY"],
    },
    WOMEN: {
      title: "여성",
      types: ["HOME", "AWAY", "THIRD"],
    },
    KIDS: {
      title: "키즈",
      types: ["HOME", "AWAY", "THIRD"],
    },
  };

  const kitTypeMap = {
    HOME: { displayName: "홈 유니폼", description: "23/24 시즌 홈 유니폼" },
    AWAY: { displayName: "어웨이 유니폼", description: "23/24 시즌 어웨이 유니폼" },
    THIRD: { displayName: "써드 유니폼", description: "23/24 시즌 써드 유니폼" },
    GOALKEEPER_HOME: { displayName: "홈 골키퍼 유니폼", description: "23/24 시즌 홈 골키퍼 유니폼" },
    GOALKEEPER_AWAY: { displayName: "어웨이 골키퍼 유니폼", description: "23/24 시즌 어웨이 골키퍼 유니폼" },
  };

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];

  // 사이즈 선택 핸들러 추가
  const handleSizeChange = (size) => {
    const currentSizes = formData.sizes.split(",").filter(s => s.trim());
    let newSizes;
    if (currentSizes.includes(size)) {
      newSizes = currentSizes.filter(s => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }
    setFormData({
      ...formData,
      sizes: newSizes.join(",")
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2">성별 카테고리</label>
          <div className="flex gap-4">
            {Object.keys(categories).map((gender) => (
              <button
                type="button"
                key={gender}
                onClick={() => setFormData({
                  ...formData,
                  gender: gender,
                  kitType: categories[gender].types[0]
                })}
                className={`px-4 py-2 rounded ${
                  formData.gender === gender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {categories[gender].title}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2">유니폼 타입</label>
          <select
            name="kitType"
            value={formData.kitType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {formData.gender && categories[formData.gender].types.map((type) => (
              <option key={type} value={type}>
                {kitTypeMap[type]?.displayName || type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">상품명</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">가격</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">재고</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">사이즈</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <label key={size} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">이미지</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept="image/*"
              className="mt-1 block w-full"
            />
            {formData.images.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                {formData.images.length}개의 파일이 선택됨
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          상품 등록
        </button>
      </form>
    </div>
  );
};

export default StoreAdminAddComponent;
