import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";

const LogoutComponent = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 전 상태 로깅
            console.log('로그아웃 시도 전 상태:', {
                isLogin: localStorage.getItem('isLogin'),
                userEmail: localStorage.getItem('userEmail'),
                userName: localStorage.getItem('userName'),
                userToken: localStorage.getItem('userToken'),
                auth: localStorage.getItem('auth')
            });

            // 로컬 스토리지 클리어
            localStorage.removeItem('isLogin');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userAddress');
            localStorage.removeItem('auth');

            // 로그아웃 후 상태 로깅
            console.log('로컬 스토리지 클리어 후 상태:', {
                isLogin: localStorage.getItem('isLogin'),
                userEmail: localStorage.getItem('userEmail'),
                userName: localStorage.getItem('userName'),
                userToken: localStorage.getItem('userToken'),
                auth: localStorage.getItem('auth')
            });

            alert('로그아웃 되었습니다');
            navigate('/');
            window.location.reload(); // 페이지 새로고침

        } catch (error) {
            console.error('로그아웃 에러:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <button onClick={handleLogout} className="cart-btn">
            {/* <IoLogOut /> */}
            <span className="button-tooltip">Logout</span>
        </button>
    );
};

export default LogoutComponent;
