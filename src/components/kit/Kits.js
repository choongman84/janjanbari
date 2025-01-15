import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import KitListComponent from "./KitListComponent";
// import KitSearch from "./KitSearch";
import { getList } from "../api/kitApi";
import Pagination from "../common/Pagination";

const Kits = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchKits();
  }, [searchParams]);

  const fetchKits = async () => {
    try {
      setLoading(true);
      setError(null);
      //const params = Object.fromEntries(searchParams.entries());
      const data = await getList();
      setKits(data);
    } catch (error) {
      setError("상품 목록을 불러오는데 실패했습니다.");
      console.error("상품 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    const params = Object.entries(filters)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  const handleKitDelete = (deletedKitId) => {
    console.log("Deleting Kit with ID:", deletedKitId);

    // Update the kits state by filtering out the deleted kit
    setKits(prevKits => prevKits.filter(kit => kit.id !== deletedKitId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = kits && kits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = kits && Math.ceil(kits.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">


      {kits.length === 0 ? (
        <NoResults />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentItems.map((kit) => (
              <KitListComponent
                key={kit.id}
                kit={kit}
                onDelete={handleKitDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 py-8">
    {message}
  </div>
);

const NoResults = () => (
  <div className="text-center py-8 text-gray-500">
    검색 결과가 없습니다.
  </div>
);

export default Kits;
