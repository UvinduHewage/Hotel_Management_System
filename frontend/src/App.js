import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
// import Sidebar from "./components/Uvindu_components/Sidebar";
// import Header from "./components/Uvindu_components/Header";
// import Dashboard from "./components/Uvindu_components/Dashboard";

import BillingPage from "./pages/Dineth_pages/BillingPage";
import PaymentWithStripe from "./components/Dineth_Components/PaymentWithStripe"; 

import CustomerBill from "./pages/Dineth_pages/CustomerBill";  // ✅ Import wrapper component

 

import AllBillsPage from "./pages/Dineth_pages/AllBillsPage"; 

import "./App.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="app-container">
      {/* <Header onSidebarToggle={handleSidebarToggle} /> */}
      <div className="flex mt-16">
        {/* <Sidebar isVisible={isSidebarVisible} /> */}
        <div className="content flex-1 p-6">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            
          
   
            <Route path="/payment" element={<PaymentWithStripe />} />
            
            {/* <Route path="/confirm-booking" element={<BookingConfirmationForm />} /> */}
            {/* <Route path="/rooms" element={<RoomList />} /> */}
 
            {/* <Route path="/reservations" element={<ReservationList />} /> */}
        
              {/* <Route path="/admin/rooms" element={<RoomManager />} /> */}
              <Route path="/billP" element={<BillingPage />} />
              <Route path="/Cus_bill" element={<CustomerBill />} />

              
             <Route path="/all-bills" element={<AllBillsPage />} />
       
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
