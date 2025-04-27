import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const StaffExport = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffStats, setStaffStats] = useState({
    totalStaff: 0,
    onDuty: 0,
    attendanceRate: 0,
    openPositions: 0,
    activeStaff: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/staff");
        
        const totalStaff = response.data.length;
        const onDuty = response.data.filter(
          (staffMember) => staffMember.status === "Active"
        ).length;
        const attendanceRate =
          totalStaff > 0 ? ((onDuty / totalStaff) * 100).toFixed(2) : 0;
        const activeResponse = await axios.get(
          "/api/staff/active-count"
        );
        const openPositions = totalStaff - onDuty;

        setStaffStats({
          totalStaff,
          onDuty,
          attendanceRate,
          openPositions,
          activeStaff: activeResponse.data.activeStaff || 0,
        });
        
        setStaff(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError("Failed to load staff data. Please try again later.");
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const goToDashboard = () => navigate("/dashboard");

  // Function to export data to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const staffData = staff.map((member) => ({
      Name: `${member.firstName} ${member.lastName}`,
      Role: member.jobTitle,
      Department: member.department,
      Status: member.status,
      Email: member.email || "N/A",
      Phone: member.phone || "N/A",
      "Date Joined": member.dateJoined ? new Date(member.dateJoined).toLocaleDateString() : "N/A"
    }));

    // Create stats for the first sheet
    const statsData = [
      ["Staff Statistics", ""],
      ["Total Staff", staffStats.totalStaff],
      ["On Duty Today", staffStats.onDuty],
      ["Attendance Rate", `${staffStats.attendanceRate}%`],
      ["Open Positions", staffStats.openPositions],
      ["Active Staff", staffStats.activeStaff],
      ["", ""],
      ["Report Generated On", new Date().toLocaleString()]
    ];

    // Create workbook with two sheets
    const wb = XLSX.utils.book_new();
    
    // Add stats sheet
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsSheet, "Staff Statistics");
    
    // Add staff details sheet
    const staffSheet = XLSX.utils.json_to_sheet(staffData);
    XLSX.utils.book_append_sheet(wb, staffSheet, "Staff Details");
    
    // Save the file
    XLSX.writeFile(wb, "Staff_Report.xlsx");
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Staff Report", 14, 22);
    
    // Add generation date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add stats section
    doc.setFontSize(14);
    doc.text("Staff Statistics", 14, 40);
    
    // Stats table
    const statsData = [
      ["Metric", "Value"],
      ["Total Staff", staffStats.totalStaff.toString()],
      ["On Duty Today", staffStats.onDuty.toString()],
      ["Attendance Rate", `${staffStats.attendanceRate}%`],
      ["Open Positions", staffStats.openPositions.toString()],
      ["Active Staff", staffStats.activeStaff.toString()]
    ];
    
    doc.autoTable({
      startY: 45,
      head: [statsData[0]],
      body: statsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [75, 75, 75] }
    });
    
    // Staff details table
    doc.setFontSize(14);
    doc.text("Staff Details", 14, doc.autoTable.previous.finalY + 15);
    
    const staffTableData = staff.map(member => ([
      `${member.firstName} ${member.lastName}`,
      member.jobTitle,
      member.department,
      member.status
    ]));
    
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [["Name", "Role", "Department", "Status"]],
      body: staffTableData,
      theme: 'grid',
      headStyles: { fillColor: [75, 75, 75] }
    });
    
    // Save the PDF
    doc.save("Staff_Report.pdf");
  };

  const renderStatusBadge = (status) =>
    status === "Active" ? (
      <span className="bg-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full text-white">
        Active
      </span>
    ) : (
      <span className="bg-red-500 text-xs font-medium px-2.5 py-0.5 rounded-full text-white">
        Inactive
      </span>
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-red-100 border border-red-300">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={goToDashboard}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Data Export</h1>
        <div className="space-x-4">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export to Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Export to PDF
          </button>
          <button
            onClick={goToDashboard}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Staff Statistics with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {[ 
          { title: "Total Staff", value: staffStats.totalStaff },
          { title: "On Duty Today", value: staffStats.onDuty },
          { title: "Attendance Rate", value: `${staffStats.attendanceRate}%` },
          { title: "Open Positions", value: staffStats.openPositions },
          { title: "Active Staff", value: staffStats.activeStaff },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-lg border border-white/40 bg-white/30 backdrop-blur-md flex flex-col items-center"
          >
            <h3 className="text-sm font-bold text-black text-center">{stat.title}</h3>
            <p className="text-lg font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Staff Table Preview */}
      <div className="p-6 rounded-lg shadow-md border border-white/40 bg-white/30 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-black mb-6">Staff Data Preview</h2>
        <p className="text-sm text-gray-600 mb-4">
          This data will be included in your exported files. Click the export buttons above to download.
        </p>
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-white/40 border-b">
                  {["Profile", "Name", "Role", "Department", "Status", "Email", "Phone"].map(
                    (header, i) => (
                      <th key={i} className="py-3 px-6 text-sm font-medium text-black">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr
                    key={staffMember._id}
                    className="border-b hover:bg-white/40 transition-all duration-300"
                  >
                    <td className="py-3 px-6">
                      <img
                        src={
                          staffMember.profilePic
                            ? `/uploads/${staffMember.profilePic}`
                            : "/default-avatar.jpg"
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="text-sm py-3 px-6 text-black">
                      {staffMember.firstName} {staffMember.lastName}
                    </td>
                    <td className="text-sm py-3 px-6 text-black">{staffMember.jobTitle}</td>
                    <td className="text-sm py-3 px-6 text-black">{staffMember.department}</td>
                    <td className="text-sm py-3 px-6 text-black">
                      {renderStatusBadge(staffMember.status)}
                    </td>
                    <td className="text-sm py-3 px-6 text-black">
                      {staffMember.email || "N/A"}
                    </td>
                    <td className="text-sm py-3 px-6 text-black">
                      {staffMember.phone || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffExport;