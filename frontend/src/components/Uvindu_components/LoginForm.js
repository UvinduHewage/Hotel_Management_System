import React, { useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUserRegistered, setIsUserRegistered] = useState(true); // To track if the user is registered

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a login attempt (you should replace this with an actual login API call)
    const isRegistered = checkUserRegistration(email); // Replace this with your actual check
    if (isRegistered) {
      handleLogin({ email, password });
    } else {
      setIsUserRegistered(false);
    }
  };

  const checkUserRegistration = (email) => {
    // Simulate checking if the user is registered (you should replace this with an actual check, such as API request)
    const registeredEmails = ["test@example.com", "user@example.com"]; // Example registered emails
    return registeredEmails.includes(email);
  };

  // If the user is not registered, redirect to the signup page
  if (!isUserRegistered) {
    return <Navigate to="/signup" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
        Login
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => setIsUserRegistered(false)}>
            Sign up
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
