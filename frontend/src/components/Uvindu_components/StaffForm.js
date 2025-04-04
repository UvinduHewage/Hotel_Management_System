// src/components/Uvindu_components/StaffForm.js

import React, { useState } from "react";

const StaffForm = ({ onSubmit }) => {
  const [staff, setStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    shifts: {
      morning: false,
      afternoon: false,
      night: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setStaff({
        ...staff,
        shifts: { ...staff.shifts, [name]: checked },
      });
    } else {
      setStaff({ ...staff, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(staff);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Staff Member</h2>
      <label>Profile Picture</label>
      <input type="file" name="profilePic" />
      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        value={staff.firstName}
        onChange={handleChange}
      />
      <label>Last Name</label>
      <input
        type="text"
        name="lastName"
        value={staff.lastName}
        onChange={handleChange}
      />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={staff.email}
        onChange={handleChange}
      />
      <label>Phone</label>
      <input
        type="tel"
        name="phone"
        value={staff.phone}
        onChange={handleChange}
      />
      <label>Job Title</label>
      <input
        type="text"
        name="jobTitle"
        value={staff.jobTitle}
        onChange={handleChange}
      />
      <label>Department</label>
      <input
        type="text"
        name="department"
        value={staff.department}
        onChange={handleChange}
      />
      <label>Shift Schedule</label>
      <div>
        <label>
          Morning Shift
          <input
            type="checkbox"
            name="morning"
            checked={staff.shifts.morning}
            onChange={handleChange}
          />
        </label>
        <label>
          Afternoon Shift
          <input
            type="checkbox"
            name="afternoon"
            checked={staff.shifts.afternoon}
            onChange={handleChange}
          />
        </label>
        <label>
          Night Shift
          <input
            type="checkbox"
            name="night"
            checked={staff.shifts.night}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Add Staff Member</button>
    </form>
  );
};

export default StaffForm;
