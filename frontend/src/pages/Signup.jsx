import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

 const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
   // alert("Passwords do not match!");
    return;
  }

  try {
    // No need to assign response if you don't use it
    await axios.post("http://localhost:5000/api/auth/signup", {
      email,
      password,
      username,
    });

    alert("Signup successful!");
    navigate("/"); // Navigate to login page
  } catch (err) {
    console.error(err);
   // alert(err.response?.data?.error || "Something went wrong!");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-gradient">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Signup</h2>

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Signup
        </button>

        <div className="text-center text-gray-400">
          Already have an account?{" "}
          <a href="/" className="text-blue-400 hover:text-blue-500">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
