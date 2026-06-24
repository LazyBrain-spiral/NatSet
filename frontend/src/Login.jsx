import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError, handleSuccess } from "./Utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function login() {
  const navigate = useNavigate();
  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyloginInfo = { ...loginInfo };
    copyloginInfo[name] = value;
    setloginInfo(copyloginInfo);
  };

  const handlelogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Please fill all the fields"); 
    }

    try {
      const url = "http://localhost:3001/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      const { success, message, jwtToken, name, error } = data;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data._id);
        
        setloginInfo({ email: "", password: "" });
        setTimeout(() => {
          if (data.role === "freelancer") {
            navigate("/freelancer/home");
          } else {
            navigate("/client/home");
          }
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("login failed");
    }
  };
  console.log(loginInfo);
  return (
    <form onSubmit={handlelogin}>
      <ToastContainer />
      <div className="min-h-screen [background:radial-gradient(ellipse_at_center,#1a2535_0%,#080d14_100%)]">
        <div className="flex justify-start pl-70 items-center h-screen backdrop-blur-lg">
          <div className="flex flex-col gap-5 p-8 border border-gray-600 rounded-lg [background:radial-gradient(ellipse_at_center,#0a1f38_0%,#050c15_100%)] backdrop-blur-2xl w-96">
            <p className="text-white text-2xl">Sign In</p>
            <label className="text-white">
              <p className="text-gray-500">Email:</p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={loginInfo.email}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              />
            </label>
            <label className="text-white">
              <p className="text-gray-500">Password:</p>
              <input
                type="password"
                placeholder="*****"
                onChange={handleChange}
                value={loginInfo.password}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
                name="password"
              />
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot your password?
              </a>
            </label>
            <input
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400 hover:bg-amber-400 cursor-alias"
              type="submit"
              value="Sign in"
            />

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-600" />
              <span className="text-gray-500 text-sm">or</span>
              <hr className="flex-1 border-gray-600" />
            </div>
            <input
              className="w-full px-1 py-1 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400 hover:bg-amber-400"
              type="submit"
              value="Sign in with Google"
            />
            <input
              className="w-full px-1 py-1 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400 hover:bg-amber-400"
              type="submit"
              value="Sign in with Facebook"
            />
          </div>
          <p className="text-white text-2xl pl-80">use your thing here</p>
        </div>
      </div>
    </form>
  );
}

export default login;
