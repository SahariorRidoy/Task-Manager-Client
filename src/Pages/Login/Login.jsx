import { useContext, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { handleGoogleLogin, setUser } = useContext(AuthContext);

  // Google Login Function
  const submitGoogleLogin = (e) => {
    e.preventDefault();

    handleGoogleLogin()
      .then(async (result) => {
        const user = result.user;
        setUser(user);

        // Construct userData object
        const userData = {
          displayName: user?.displayName || "Unknown User",
          email: user?.email || "No Email",
          photoURL: user?.photoURL || "",
        };

        // Send user data to backend
        await axios.post("http://localhost:5000/users", userData);

        // Navigate after login
        navigate("/home");
      })
      .catch((error) => console.error("Login Error:", error));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"
      />

      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-10 w-[90%] sm:w-[60%] md:w-[45%] lg:w-[35%] flex flex-col items-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Welcome to TaskManager</h2>
        <p className="text-white/80 text-sm text-center mb-6">
          Organize your tasks effortlessly with a single sign-in.
        </p>

        {/* Google Sign-In Button */}
        <motion.button
          onClick={submitGoogleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex cursor-pointer items-center gap-3 bg-white/20 hover:bg-white/30 transition duration-300 px-6 py-3 rounded-full text-white shadow-md backdrop-blur-md"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </motion.button>

        <p className="text-white/60 text-xs mt-6">Stay productive. Stay focused.</p>
      </motion.div>
    </div>
  );
};

export default Login;
