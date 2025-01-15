import React from 'react'
import ProductBuyDetailComponent from '../../components/kit/ProductBuyDetailComponent';

const KitDetailPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 상세</h1>
      <ProductBuyDetailComponent />
    </div>
  );
}

export default KitDetailPage