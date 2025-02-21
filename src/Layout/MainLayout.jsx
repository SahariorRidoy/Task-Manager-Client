
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className=" flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="flex-grow w-full">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
