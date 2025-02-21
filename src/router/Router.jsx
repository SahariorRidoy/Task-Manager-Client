import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import ErrorPage from "../components/Error/ErrorPage";
import Login from "../Pages/Login/Login";
import PrivateRoute from "../PrivateRoute/PriveteRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Login></Login>,
      },
      {
        path: "/home",
        element: <PrivateRoute><Home></Home></PrivateRoute>,
      },
      
    ],
  },
  
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);

export default router;
