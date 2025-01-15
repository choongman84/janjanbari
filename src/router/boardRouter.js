import { lazy, Suspense } from "react"

const boardRouter = () => {

    const Loading = <div>....</div>
    const BoardList = lazy(() => import("../pages/board/BoardListPage"))
    const AdddBoard = lazy(() => import("../pages/board/BoardAddPage"))
    const DetailBoard = lazy(() => import("../pages/board/BoardDetailPage"))

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><BoardList /></Suspense>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><AdddBoard /></Suspense>
        },
        {
            path: ":bno",
            element: <Suspense fallback={Loading}><DetailBoard /></Suspense>
        }


    ]
}
export default boardRouter