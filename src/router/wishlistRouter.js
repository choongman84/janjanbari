import React, { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;

const WishlistPage = lazy(() => import("../pages/wishlist/WishlistPage"));

const wishlistRouter = () => {
    return [
        {
            path: "",
            element: (
                <Suspense fallback={Loading}>
                    < WishlistPage />
                </Suspense>
            ) 
                
        }
    ]
}

export default wishlistRouter;