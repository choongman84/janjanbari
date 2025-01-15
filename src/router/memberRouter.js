import React, { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;

const MyPage = lazy(() => import("../pages/member/MyPageList"));
const BoardsPage = lazy(() => import("../pages/member/BoardsPage"));
const CommentsPage = lazy(() => import("../pages/member/CommentsPage"));
const BoardInquiryPage = lazy(() => import("../pages/member/BoardsPage"));


const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const LogoutPage = lazy(() => import("../pages/login/LogoutPage"))
const memberRouter = () => {
  return [
    {
      path: "login",
      element: (
        <Suspense fallback={Loading}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "logout",
      element: (
        <Suspense fallback={Loading}>
          <LogoutPage />
        </Suspense>
      )
    },
    {
      path: "mypage",
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
      children: [
        {
          path: "boards",
          element: (
            <Suspense fallback={Loading}>
              <BoardsPage />
            </Suspense>
          ),
        },
        {
          path: "boardinquiry",
          element: (
            <Suspense fallback={Loading}>
              <BoardInquiryPage /> {/* 대소문자 수정 */}
            </Suspense>
          ),
        },
        ],
    },
    {
      path: "boards",
      element: (
        <Suspense fallback={Loading}>
          <BoardsPage />
        </Suspense>
      ),
    },
    {
      path: "comments",
      element: (
        <Suspense fallback={Loading}>
          <CommentsPage />
        </Suspense>
      ),
    },
  ];
};

export default memberRouter;
