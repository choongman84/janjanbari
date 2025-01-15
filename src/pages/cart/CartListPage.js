import React from 'react'
import CartListComponent from '../../components/cart/CartListComponent';

const CartListPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">장바구니 목록</h1>
            <CartListComponent />
        </div>
    );
}

export default CartListPage