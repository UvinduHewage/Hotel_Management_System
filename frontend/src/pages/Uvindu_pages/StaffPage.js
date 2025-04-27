import React, { useState, useEffect } from "react";
import StaffCard from "../components/Uvindu_components/StaffCard";
import StaffTable from "../components/Uvindu_components/StaffTable";
import { Link } from "react-router-dom";

const StaffPage = () => {
  const [staffData, setStaffData] = useState([]);
  
  const stats = [
    { title: "Total Staff", value: 50 },
    { title: "On Duty Today", value: 20 },
    { title: "Attendance Rate", value: "95%" },
    { title: "Open Positions", value: 5 },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then((res) => res.json())
      .then((data) => setStaffData(data))
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  const handleUpdate = (id) => {
    console.log(`Update staff with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete staff with id: ${id}`);
  };

  return (
    <div>
      <div className="staff-header">
        <Link to="/add-staff">
          <button>Add New Staff</button>
        </Link>
      </div>
      <div className="staff-cards">
        {stats.map((stat, index) => (
          <StaffCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
      <div className="staff-table">
        <StaffTable staff={staffData} onUpdate={handleUpdate} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default StaffPage;
