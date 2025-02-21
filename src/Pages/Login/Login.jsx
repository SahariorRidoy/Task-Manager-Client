import { useContext } from "react";
import googleImg from "../../assets/google.png";
import { AuthContext } from "../../Provider/AuthProvider";
import toast from "react-hot-toast";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const {handleGoogleLogin, setUser } = useContext(AuthContext);
  // Google Login
  const submitGoogleLogin = (e) => {
    e.preventDefault();
    handleGoogleLogin()
      .then((result) => {
        const user = result.user;
        setUser(user);
        console.log(user);
        navigate("/home");
        toast.success("Login Successful!", {
          duration: 4000,
        });
       
      })
      .catch((error) => {});
  };


  return (
    <div className="max-w-sm lg:max-w-xl lg:mx-auto  border-2 bg-base-300 shadow-lg rounded-lg py-10 mx-4 lg:px-0 ">
      <div className="text-center">
        <h1 className="text-[#11175D] w-full overflow-hidden text-4xl font-bold mb-7">
          <Typewriter
            words={["Login to your account!"]}
            cursorStyle="|"
            typeSpeed={70}
            delaySpeed={1000}
          />
        </h1>
      </div>
      <div className="text-center flex justify-center">
       
      
         
          <div className="hover:opacity-50 cursor-pointer w-60 flex gap-3 mx-auto border-[#11175D] rounded-full items-center py-2 border-2 pl-7 pr-10 border-opacity-30 my-4">
            <img src={googleImg} alt="" />

            <button onClick={submitGoogleLogin}>Login with Google</button>
          </div>
         
      
      </div>
    </div>
  );
};

export default Login;
