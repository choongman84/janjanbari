import jwtAxios from "../../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/admin/kits`

export const saveKit = async (formData, token) => {
    console.log("111) saveKit : ", formData, token);
    try {
        const response = await jwtAxios.post(host, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the JWT token
            },
        });
        console.log("Kit added successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error saving kit:", error.response?.data || error.message);
        throw error;
    }
};
