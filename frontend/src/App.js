import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";  // ✅ No BrowserRouter here!

import BillingPage from "./pages/Dineth_pages/BillingPage";
import PaymentWithStripe from "./components/Dineth_Components/PaymentWithStripe";
import CustomerBill from "./pages/Dineth_pages/CustomerBill";
import AllBillsPage from "./pages/Dineth_pages/AllBillsPage";

import RoomGallery from "./pages/Tharinda_pages/RoomGallery";
import RoomDetailsPage from "./pages/Tharinda_pages/RoomDetailsPage";
import RoomTable from "./pages/Tharinda_pages/RoomTable";
import RoomDetail from "./pages/Tharinda_pages/RoomDetail";
import UpdateRoom from "./pages/Tharinda_pages/UpdateRoom";
import CreateRoom from "./pages/Tharinda_pages/CreateRoom";

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
          <Routes>  {/* ✅ No extra <Router>, just Routes */}
            <Route path="/" element={<RoomTable />} />
            <Route path="/payment" element={<PaymentWithStripe />} />
            <Route path="/roomsUI" element={<RoomGallery />} />
            <Route path="/room-details/:roomNumber" element={<RoomDetailsPage />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/rooms/update/:id" element={<UpdateRoom />} />
            <Route path="/create-room" element={<CreateRoom />} />
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
