import { lazy, Suspense } from "react"

const boardRouter = () => {

    const Loading = <div>....</div>
    const StoreAddPage = lazy(() => import("../pages/admin/StoreAddPage"))

    return [
        {
            path: "store/add",
            element: <Suspense fallback={Loading}><StoreAddPage /></Suspense>
        }

    ]
}
export default boardRouter