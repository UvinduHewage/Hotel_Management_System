import React from "react";
import LoginForm from "../../components/Uvindu_components/LoginForm";
import axios from "axios";

const LoginPage = () => {
  const handleLogin = async (userData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", userData);
      console.log(response.data);
      // Handle successful login (store token, redirect, etc.)
    } catch (error) {
      console.error("Error during login:", error.response?.data);
    }
  };

  return (
    <div>
      <LoginForm handleLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
