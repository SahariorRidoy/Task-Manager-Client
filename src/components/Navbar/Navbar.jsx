import React from 'react';
import { useContext,} from "react";

import { AuthContext } from "../../Provider/AuthProvider";
const Navbar = () => {
    
  const { logOut, user } = useContext(AuthContext);
    return (
        <div className=" bg-blue-400 ">
        {user?.photoURL ? (
          <div
            className="max-w-[1320px] mx-auto py-2 flex justify-between items-center"
            
          >
            <div>
            <img
              src={user.photoURL}
              alt="User Photo"
              className="w-14 h-14 rounded-full object-cover"
            />
            </div>
              <div>
              <button
                  onClick={logOut}
                  className="w-full cursor-pointer text-left px-4 py-2 bg-red-400 text-white font-semibold  rounded-lg hover:opacity-70 transition"
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
    );
};

export default Navbar;