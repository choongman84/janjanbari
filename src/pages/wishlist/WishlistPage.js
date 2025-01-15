import React from 'react'
import WishlistComponent from '../../components/wishlist/WishlistComponent';

const WishlistPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">찜 목록</h1>
      <WishlistComponent />
    </div>
  );
}

export default WishlistPage