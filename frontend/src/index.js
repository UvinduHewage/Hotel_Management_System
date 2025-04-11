// src/index.js - Application entry point (updated without AuthContext dependency)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application without context providers for now
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>
);