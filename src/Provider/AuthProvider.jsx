import  { createContext, useEffect, useState } from "react";
import app from "../firebase";
import toast from "react-hot-toast";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Google login
  const googleProvider = new GoogleAuthProvider();
  const handleGoogleLogin = () => {
    return signInWithPopup(auth, googleProvider);
  };
  //   Logout
  const logOut = () => {
    setLoading(true);
    toast.success("Log out successful!", { duration: 3000 });
    return signOut(auth);
  };
  // Passing data using context
  const authInfo = {
    handleGoogleLogin,
    logOut,
    user,
    loading,
    setLoading,
    setUser,
  };
  // Logout handler
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
