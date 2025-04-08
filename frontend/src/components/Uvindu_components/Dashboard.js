import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { pdf } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [staffStats, setStaffStats] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Company logo URL - update this with your actual logo path
  const companyLogo = "https://www.postermywall.com/index.php/art/template/e5520a805026e9d9a5dd660cf83185ba/hotel-logo-design-template"; 

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/staff");
      const totalStaff = data.length;
      const onDutyCount = data.filter((staff) => staff.status === "Active").length;
      const attendanceRate = totalStaff ? ((onDutyCount / totalStaff) * 100).toFixed(2) : 0;
      const activeStaffResponse = await axios.get("http://localhost:5000/api/staff/active-count");

      // Organize staff by department for department stats
      const deptMap = {};
      data.forEach(staff => {
        if (!deptMap[staff.department]) {
          deptMap[staff.department] = {
            total: 0,
            active: 0,
            roles: {}
          };
        }
        
        deptMap[staff.department].total++;
        if (staff.status === "Active") {
          deptMap[staff.department].active++;
        }
        
        // Track role distribution
        if (!deptMap[staff.department].roles[staff.jobTitle]) {
          deptMap[staff.department].roles[staff.jobTitle] = 0;
        }
        deptMap[staff.department].roles[staff.jobTitle]++;
      });

      setDepartmentData(deptMap);
      
      setStaffStats({
        totalStaff,
        onDuty: onDutyCount,
        attendanceRate,
        openPositions: totalStaff - onDutyCount,
        activeStaff: activeStaffResponse.data.activeStaff || 0,
      });

      setStaffList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setLoading(false);
    }
  };

  const handleAddStaff = () => navigate("/staff/add");

  // New Excel export function with multiple sheets
  const exportToExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const hotelName = "Grand Horizon Hotel & Resort";
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      
      const colors = {
        primary: { bg: "1E40AF", font: "FFFFFF" },
        secondary: { bg: "4F46E5", font: "FFFFFF" },
        accent: { bg: "2563EB", font: "FFFFFF" },
        header: { bg: "F3F4F6", font: "1F2937" }
      };
      
      // Sheet 1: Staff Overview with enhanced styling
      const staffOverviewData = [
        [`${hotelName} - Staff Management Report`],
        ["Generated on", currentDate, "at", currentTime],
        ["Key Statistics"],
        ["Total Staff", staffStats.totalStaff],
        ["On Duty", staffStats.onDuty],
        ["Attendance Rate", `${staffStats.attendanceRate}%`],
        ["Open Positions", staffStats.openPositions],
        ["Active Staff", staffStats.activeStaff]
      ];
      
      const overviewSheet = XLSX.utils.aoa_to_sheet(staffOverviewData);
      
      // Styling for header (merging cells)
      overviewSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, 
        { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }  
      ];
      
      // Apply cell styling - this is where we add color
      if (!overviewSheet['!cols']) overviewSheet['!cols'] = [];
      overviewSheet['!cols'][0] = { wch: 20 }; // Width of first column
      
      // Set some custom cell styles (Excel doesn't fully support all CSS, but we can do basic colors)
      // Title cell styling
      overviewSheet.A1 = { 
        v: hotelName + " - Staff Management Report", 
        t: 's',
        s: { 
          font: { bold: true, color: { rgb: colors.primary.font }, sz: 16 },
          fill: { fgColor: { rgb: colors.primary.bg } },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      };
      
      // Key Statistics header styling
      overviewSheet.A4 = { 
        v: "Key Statistics", 
        t: 's',
        s: { 
          font: { bold: true, color: { rgb: colors.secondary.font }, sz: 14 },
          fill: { fgColor: { rgb: colors.secondary.bg } },
          alignment: { horizontal: 'center' }
        }
      };
      
      // Add the overview sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, overviewSheet, "Staff Overview");
  
      // Sheet 2: Staff List with department color coding
      const staffHeaders = ["Name", "Job Title", "Department", "Status", "Email", "Phone"];
      const staffListData = staffList.map(staff => [
        `${staff.firstName} ${staff.lastName}`,
        staff.jobTitle,
        staff.department,
        staff.status,
        staff.email || "N/A",
        staff.phone || "N/A"
      ]);
      
      // Add headers to the data
      staffListData.unshift(staffHeaders);
      
      const staffSheet = XLSX.utils.aoa_to_sheet(staffListData);
      
      // Set column widths for better readability
      if (!staffSheet['!cols']) staffSheet['!cols'] = [];
      staffSheet['!cols'][0] = { wch: 20 }; 
      staffSheet['!cols'][1] = { wch: 25 }; 
      staffSheet['!cols'][2] = { wch: 20 }; 
      staffSheet['!cols'][4] = { wch: 30 }; 
      
      // Style the header row
      for (let i = 0; i < staffHeaders.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        staffSheet[cellRef] = {
          v: staffHeaders[i],
          t: 's',
          s: {
            font: { bold: true, color: { rgb: colors.header.font } },
            fill: { fgColor: { rgb: colors.header.bg } },
            alignment: { horizontal: 'center' }
          }
        };
      }
      
      XLSX.utils.book_append_sheet(workbook, staffSheet, "Staff List");
  
      // Sheet 3: Department Analysis with fancy formatting
      const departmentHeaders = ["Department", "Total Staff", "Active Staff", "Inactive Staff", "Active %"];
      const departmentRows = Object.keys(departmentData).map(dept => {
        const deptInfo = departmentData[dept];
        const activePercentage = ((deptInfo.active / deptInfo.total) * 100).toFixed(2);
        
        return [
          dept,
          deptInfo.total,
          deptInfo.active,
          deptInfo.total - deptInfo.active,
          `${activePercentage}%`
        ];
      });
      
      // Add headers to the department data
      departmentRows.unshift(departmentHeaders);
      
      const departmentSheet = XLSX.utils.aoa_to_sheet(departmentRows);
      
      // Set column widths for better readability
      if (!departmentSheet['!cols']) departmentSheet['!cols'] = [];
      departmentSheet['!cols'][0] = { wch: 25 }; // Department name column
      
      // Style the header row
      for (let i = 0; i < departmentHeaders.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        departmentSheet[cellRef] = {
          v: departmentHeaders[i],
          t: 's',
          s: {
            font: { bold: true, color: { rgb: colors.header.font } },
            fill: { fgColor: { rgb: colors.header.bg } },
            alignment: { horizontal: 'center' }
          }
        };
      }
      
      XLSX.utils.book_append_sheet(workbook, departmentSheet, "Department Analysis");
  
      // Sheet 4: Role Distribution with enhanced visuals
      const roleDistributionData = [["Department", "Job Title", "Count"]];
      
      // Populate role distribution data
      Object.keys(departmentData).forEach(dept => {
        const roles = departmentData[dept].roles;
        Object.keys(roles).forEach(role => {
          roleDistributionData.push([dept, role, roles[role]]);
        });
      });
      
      const roleSheet = XLSX.utils.aoa_to_sheet(roleDistributionData);
      
      // Set column widths for better readability
      if (!roleSheet['!cols']) roleSheet['!cols'] = [];
      roleSheet['!cols'][0] = { wch: 25 }; 
      roleSheet['!cols'][1] = { wch: 30 }; 
      
      // Style the header row
      for (let i = 0; i < 3; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        roleSheet[cellRef] = {
          v: roleDistributionData[0][i],
          t: 's',
          s: {
            font: { bold: true, color: { rgb: colors.header.font } },
            fill: { fgColor: { rgb: colors.header.bg } },
            alignment: { horizontal: 'center' }
          }
        };
      }
      
      XLSX.utils.book_append_sheet(workbook, roleSheet, "Role Distribution");
  
      // Sheet 5: Hotel Staff Scheduling (added for hotel context)
      const scheduleHeaders = ["Staff Name", "Position", "Department", "Shift Time", "Days", "Special Notes"];
      
      // Sample scheduling data - in a real app, this would come from your database
      const schedulingData = staffList.slice(0, 15).map(staff => {
        // Generate realistic hotel scheduling data
        const shifts = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Night (10PM-6AM)"];
        const randomShift = shifts[Math.floor(Math.random() * shifts.length)];
        
        const days = ["Mon-Fri", "Tue-Sat", "Wed-Sun", "Thu-Mon", "Fri-Tue", "Sat-Wed", "Sun-Thu"];
        const randomDays = days[Math.floor(Math.random() * days.length)];
        
        const notes = [
          "Bilingual - Spanish",
          "Certified in food safety",
          "First aid trained",
          "Pool certified",
          "Senior staff member",
          "In training",
          "Cross-trained for bar service",
          "Event specialist",
          "VIP service qualified",
          "Security clearance"
        ];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        
        return [
          `${staff.firstName} ${staff.lastName}`,
          staff.jobTitle,
          staff.department,
          randomShift,
          randomDays,
          randomNote
        ];
      });
      
      // Add headers to scheduling data
      schedulingData.unshift(scheduleHeaders);
      
      const scheduleSheet = XLSX.utils.aoa_to_sheet(schedulingData);
      
      // Set column widths for better readability
      if (!scheduleSheet['!cols']) scheduleSheet['!cols'] = [];
      scheduleSheet['!cols'][0] = { wch: 20 }; 
      scheduleSheet['!cols'][1] = { wch: 25 }; 
      scheduleSheet['!cols'][2] = { wch: 15 }; 
      scheduleSheet['!cols'][3] = { wch: 20 }; 
      scheduleSheet['!cols'][5] = { wch: 25 }; 
      
      // Style the header row
      for (let i = 0; i < scheduleHeaders.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        scheduleSheet[cellRef] = {
          v: scheduleHeaders[i],
          t: 's',
          s: {
            font: { bold: true, color: { rgb: colors.header.font } },
            fill: { fgColor: { rgb: colors.header.bg } },
            alignment: { horizontal: 'center' }
          }
        };
      }
      
      XLSX.utils.book_append_sheet(workbook, scheduleSheet, "Staff Scheduling");
      
      // Write the workbook and trigger download with hotel name in filename
      const filename = `${hotelName.replace(/[^a-z0-9]/gi, '_')}_Staff_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  // PDF Styles for @react-pdf/renderer
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 30,
      fontFamily: 'Helvetica',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 20,
    },
    logo: {
      width: 70,
      height: 70,
      marginRight: 20,
    },
    headerTextContainer: {
      flex: 1,
    },
    header: {
      fontSize: 16,
      color: '#1e40af',
      fontWeight: 'bold',
    },
    subheader: {
      fontSize: 16,
      marginBottom: 20,
      marginTop: 10,
      color: '#1e40af',
      fontWeight: 'bold',
    },
    companyInfo: {
      fontSize: 10,
      color: '#6b7280',
    },
    statsContainer: {
      marginBottom: 30,
    },
    statBox: {
      marginBottom: 10,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#4b5563',
    },
    statValue: {
      fontSize: 12,
      color: '#1f2937',
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      marginTop: 20,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      minHeight: 30,
      alignItems: 'center',
    },
    tableHeaderRow: {
      backgroundColor: '#f3f4f6',
    },
    tableCol: {
      width: '25%',
      padding: 8,
    },
    tableHeader: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#4b5563',
    },
    tableCell: {
      fontSize: 12,
      color: '#1f2937',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: 10,
      color: '#9ca3af',
    },
    active: {
      color: '#059669',
    },
    inactive: {
      color: '#dc2626',
    },
  });
  
  const exportToPDF = async () => {
    try {
      // Create PDF Document component
      const StaffReport = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header with Logo */}
            <View style={styles.headerContainer}>
              <Image 
                src={companyLogo} 
                style={styles.logo} 
                cache={false}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.header}>Company Name</Text>
                <Text style={styles.companyInfo}>123 Business Ave, Suite 100</Text>
                <Text style={styles.companyInfo}>Los Angeles, CA 90001</Text>
                <Text style={styles.companyInfo}>info@companyname.com | (555) 123-4567</Text>
              </View>
            </View>
            
            <Text style={styles.header}>Staff Management Report</Text>
            
            <Text style={styles.subheader}>Key Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Staff  :  </Text>
                <Text style={styles.statValue}>{staffStats.totalStaff}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>On Duty  :  </Text>
                <Text style={styles.statValue}>{staffStats.onDuty}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Attendance Rate  :  </Text>
                <Text style={styles.statValue}>{staffStats.attendanceRate}%</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Open Positions  :  </Text>
                <Text style={styles.statValue}>{staffStats.openPositions}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Active Staff  :  </Text>
                <Text style={styles.statValue}>{staffStats.activeStaff}</Text>
              </View>
            </View>
            
            <Text style={styles.subheader}>Staff List</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableHeader}>Name</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableHeader}>Role</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableHeader}>Department</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableHeader}>Status</Text>
                </View>
              </View>
              
              {/* Table Rows */}
              {staffList.map((staff, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {staff.firstName} {staff.lastName}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{staff.jobTitle}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{staff.department}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text 
                      style={[
                        styles.tableCell, 
                        staff.status === "Active" ? styles.active : styles.inactive
                      ]}
                    >
                      {staff.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={styles.footer}>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </Text>
          </Page>
        </Document>
      );
  
      // Generate PDF blob
      const blob = await pdf(<StaffReport />).toBlob();
      
      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Staff_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  

  const renderStatusBadge = (status) => (
    status === "Active" ? (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
      >
        <CheckCircle2 className="mr-1 w-3 h-3" />
        Active
      </motion.span>
    ) : (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
      >
        <XCircle className="mr-1 w-3 h-3" />
        Inactive
      </motion.span>
    )
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Action Buttons */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-end space-x-4 mb-8"
      >
        {[
          { 
            text: "Add Staff", 
            icon: UserPlus, 
            color: "blue", 
            action: handleAddStaff 
          },
          { 
            text: "Export Excel", 
            icon: FileSpreadsheet, 
            color: "green", 
            action: exportToExcel 
          },
          { 
            text: "Export PDF", 
            icon: FileText, 
            color: "red", 
            action: exportToPDF 
          }
        ].map((btn, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.action}
            className={`
              flex items-center gap-2 px-4 py-2 
              bg-${btn.color}-600 text-white 
              rounded-md shadow-md hover:bg-${btn.color}-700 
              transition-colors duration-300
            `}
          >
            <btn.icon className="w-5 h-5" />
            {btn.text}
          </motion.button>
        ))}
      </motion.div>

      {/* Key Statistics */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
      >
        {[
          { 
            title: "Total Staff", 
            value: staffStats.totalStaff, 
            icon: Users,
            color: "blue" 
          },
          { 
            title: "On Duty", 
            value: staffStats.onDuty, 
            icon: CheckCircle2,
            color: "green" 
          },
          { 
            title: "Attendance %", 
            value: `${staffStats.attendanceRate}%`, 
            icon: Users,
            color: "indigo" 
          },
          { 
            title: "Open Positions", 
            value: staffStats.openPositions, 
            icon: UserPlus,
            color: "purple" 
          },
          { 
            title: "Active Staff", 
            value: staffStats.activeStaff, 
            icon: Users,
            color: "teal" 
          }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`
              bg-${stat.color}-50 border-l-4 border-${stat.color}-500 
              p-6 rounded-lg shadow-md hover:shadow-lg 
              transition-all duration-300
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-small text-${stat.color}-600 mb-2`}>
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold text-${stat.color}-800`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Staff Table */}
      <motion.div 
        variants={itemVariants}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Current Staff Members
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                {["Profile", "Name", "Role", "Department", "Status"].map((header, i) => (
                  <th key={i} className="py-3 px-6 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {staffList.slice(0, 5).map((staff) => (
                <motion.tr
                  key={staff._id}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6">
                    <img
                      src={staff.profilePic ? `http://localhost:5000/uploads/${staff.profilePic}` : "/default-avatar.jpg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-6">{staff.firstName} {staff.lastName}</td>
                  <td className="py-3 px-6">{staff.jobTitle}</td>
                  <td className="py-3 px-6">{staff.department}</td>
                  <td className="py-3 px-6">
                    {renderStatusBadge(staff.status)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;