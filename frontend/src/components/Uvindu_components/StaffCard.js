import React from "react";

const StaffCard = ({ title, value }) => {
  return (
    <div className="staff-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StaffCard;
