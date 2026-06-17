import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError, handleSuccess } from "./Utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [SignupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role : "client"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...SignupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password,role } = SignupInfo;

    if (!name || !email || !password || !role) {
      return handleError("Please fill all the fields"); 
    }

    try {
      const url = "http://localhost:3001/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(SignupInfo),
      });
      const data = await response.json();
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setSignupInfo({ name: "", email: "", password: "",role : "client" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("Signup failed");
    }
  };
  console.log(SignupInfo);
  return (
    <form onSubmit={handleSignup}>
      <ToastContainer />
      <div className="min-h-screen [background:radial-gradient(ellipse_at_center,#1a2535_0%,#080d14_100%)]">
        <div className="flex justify-start pl-70 items-center h-screen backdrop-blur-lg">
          <div className="flex flex-col gap-5 p-8 border border-gray-600 rounded-lg [background:radial-gradient(ellipse_at_center,#0a1f38_0%,#050c15_100%)] backdrop-blur-2xl w-96">
            <p className="text-white text-2xl">Sign Up</p>
            <label className="text-white">
              <p className="text-gray-500">Username:</p>
              <input
                type="text"
                name="name"
                placeholder="Enter your username"
                onChange={handleChange}
                value={SignupInfo.name}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              />
            </label>
            <label className="text-white">
              <p className="text-gray-500">Email:</p>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                value={SignupInfo.email}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              />
            </label>
            <label className="text-white">
              <p className="text-gray-500">Password:</p>
              <input
                type="password"
                placeholder="*****"
                onChange={handleChange}
                value={SignupInfo.password}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
                name="password"
              />
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot your password?
              </a>
            </label>
            <label className="text-white">
              <p className="text-gray-500">I am a:</p>
              <select
                name="role"
                value={SignupInfo.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </label>
            <input
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400 hover:bg-amber-400 cursor-alias"
              type="submit"
              value="Sign Up"
            />

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-600" />
              <span className="text-gray-500 text-sm">or</span>
              <hr className="flex-1 border-gray-600" />
            </div>
            <input
              className="w-full px-1 py-1 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-gray-400 hover:bg-amber-400"
              type="submit"
              value="Sign up with Google"
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

export default Signup;
