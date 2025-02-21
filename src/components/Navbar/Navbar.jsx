import React from 'react';
import { useContext,} from "react";

import { AuthContext } from "../../Provider/AuthProvider";
const Navbar = () => {
    
  const { logOut, user } = useContext(AuthContext);
    return (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900"
>
        {user?.photoURL ? (
          <div
            className="max-w-[1320px] mx-auto py-2 flex justify-between items-center"
            
          >
            <div className='flex items-center gap-4'>
            <img
              src={user?.photoURL}
              className="w-14 h-14 rounded-full border  object-cover"
            />
            </div>
              <div>
              <button
                  onClick={logOut}
                  className="w-full cursor-pointer text-left px-4 py-2 bg-purple-600 text-white font-semibold border outline-fuchsia-800 border-purple-500 rounded-lg hover:opacity-70 transition"
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