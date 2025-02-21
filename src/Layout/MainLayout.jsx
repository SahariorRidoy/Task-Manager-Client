
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className=" flex flex-col min-h-screen">
      <Navbar></Navbar>
      <div className="flex-grow w-full">
       
          <Outlet />
        </div>
      
     
        <footer className="bg-gradient-to-l from-purple-700 via-indigo-800 to-blue-900 text-white text-center py-4">
          Task Manager &copy; 2025
        </footer>
      
    </div>
  );
};

export default MainLayout;
