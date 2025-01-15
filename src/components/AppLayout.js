import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="layout-content">
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AppLayout;
