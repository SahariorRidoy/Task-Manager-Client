import { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";

const MainLayout = () => {
  const { logOut, user } = useContext(AuthContext);
  return (
    <div className="flex bg-red-100 flex-col min-h-screen">
      <div className="w-full flex justify-center mr-[500px]">
        {user?.photoURL ? (
          <div
            className="flex justify-between items-center gap-10 "
            
          >
            <div>
            <img
              src={user.photoURL}
              alt="User Photo"
              className="w-12 h-12 rounded-full object-cover"
            />
            </div>
              <div>
              <button
                  onClick={logOut}
                  className="w-full text-left px-4 py-2 bg-red-400 text-white font-semibold  rounded-lg hover:opacity-70 transition"
                >
                  Logout
                </button>
              </div>
            
          </div>
          
        ) : (
          <>
            
          </>
        )}
      </div>

      <div className="flex-grow mt-10 w-full">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
