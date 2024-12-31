import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/api/auth/users");

      const user = response.data.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("userId", user.id);
        navigate("/home");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient"
      role="main"
    >
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full space-y-6"
        aria-labelledby="login-form-title"
      >
        {/* Form Title */}
        <h2
          id="login-form-title"
          className="text-3xl font-bold text-center"
          tabIndex="0"
        >
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-600 text-white p-2 rounded-md text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-required="true"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-required="true"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
          aria-label="Log in"
        >
          Login
        </button>

        {/* Signup Link */}
        <div className="text-center text-gray-400">
          <span>Don't have an account?</span>{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-500"
            aria-label="Go to signup page"
          >
            Signup
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
