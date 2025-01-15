import jwtAxios from "../../util/jwtUtil";


window.REACT_APP_API_BASE_URL="http://localhost:8080"
const API_SERVER_HOST = window.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

const BASE_URL = `${API_SERVER_HOST}/api/kits`;
console.log("kits base url :", BASE_URL);
export const getList = async () => {
    console.log("전체 목록 getlit kit");
    const response = await jwtAxios.get(`${BASE_URL}/list`);
    console.log(response);
    return response.data;
};

export const getKitDetail = async (id) => {
    const response = await jwtAxios.get(`${BASE_URL}/detail/${id}`);
    return response.data;
};

export const addToCart = async (memberId, cartItem) => {
    console.log("카트 추가 요청", { memberId, cartItem });
    try {
        const response = await jwtAxios.post(
          `${API_SERVER_HOST}/api/cart/${memberId}/items`,
          cartItem,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("카트 API 응답", response.data);
        return response.data;
    } catch (error) {
        console.error("카트 추가 에러", error);
        throw error;
    }
};

export const createKit = async (kitData, mainImage, subImages) => {
    const formData = new FormData();
    formData.append("kitDTO", new Blob([JSON.stringify(kitData)], { type: "application/json" }));
    formData.append("mainImage", mainImage);

    if (subImages && subImages.length > 0) {
        subImages.forEach(image => formData.append("subImages", image));
    }

    const response = await jwtAxios.post(`${BASE_URL}/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getKit = async (id) => {
    const response = await jwtAxios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const updateKit = async (id, kitData) => {
    const response = await jwtAxios.put(`${BASE_URL}/${id}`, kitData);
    return response.data;
};

export const deleteKit = async (id) => {
    try {
        await jwtAxios.delete(`${BASE_URL}/${id}`);
        return { success: true, message: "상품이 성공적으로 삭제되었습니다." };
    } catch (error) {
        throw new Error(`상품 삭제 실패: ${error.response?.data?.message || error.message}`);
    }
};

export const getCustomizationOptions = async (kitId) => {
    const response = await jwtAxios.get(`${BASE_URL}/${kitId}/customization-options`);
    return response.data;
};

