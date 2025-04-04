import React from "react";
import SignupForm from "../../components/Uvindu_components/SignupForm";
import axios from "axios";

const SignupPage = () => {
  const handleSignup = async (userData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", userData);
      console.log(response.data);
      
      // Handle successful signup (redirect to login page, etc.)
      alert('Signup successful! Please log in.');
    } catch (error) {
      console.error("Error during signup:", error.response.data);

      // Check if the error is because the user already exists
      if (error.response && error.response.data.message === 'User already exists') {
        alert('This email is already registered. Please use a different email.');
      } else {
        alert('An error occurred during signup. Please try again later.');
      }
    }
  };

  return (
    <div>
      <SignupForm handleSignup={handleSignup} />
    </div>
  );
};

export default SignupPage;
