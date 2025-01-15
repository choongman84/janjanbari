import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li> <Link to="/board/list" >게시글 조회</Link></li>
                <li> <Link to="/board/add" >게시글 추가</Link></li>
            </ul>
        </div>
    );
};

export default SideBar;
