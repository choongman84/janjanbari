import React, { useEffect } from 'react';
import Kits from '../../components/kit/Kits';
import ProductBuyListComponent from '../../components/kit/ProductBuyListComponent';


const KitListPage = () => {
  useEffect(() => {
    console.log("KitListPage 마운트됨");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      <ProductBuyListComponent />
    </div>
  );
};

export default KitListPage;