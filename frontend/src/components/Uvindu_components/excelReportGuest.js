import * as XLSX from 'xlsx';

const generateExcelReport = (bookings, filename = 'Hotel_Booking_Report.xlsx') => {
  // Format dates for better readability
  const formattedBookings = bookings.map((booking) => {
    // Calculate stay duration
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const stayDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      'Guest Name': booking.customerName,
      'Email': booking.email || 'N/A',
      'Room Number': booking.roomNumber,
      'Room Type': booking.roomType || 'Standard',
      'Check In': checkInDate.toLocaleDateString(),
      'Check Out': checkOutDate.toLocaleDateString(),
      'Stay Duration (Days)': stayDuration,
      'Status': booking.status,
      'Amount (LKR)': booking.price,
      'Payment Method': booking.paymentMethod || 'N/A',
      'Booking Date': booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'
    };
  });

  // Create the worksheet with the formatted data
  const worksheet = XLSX.utils.json_to_sheet(formattedBookings);
  
  // Add some styling to make headers stand out
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } }
    };
  }
  
  // Auto-size columns (approximate since actual auto-sizing happens in Excel)
  const colWidths = formattedBookings.reduce((widths, row) => {
    Object.keys(row).forEach((key, i) => {
      const cellValue = String(row[key]);
      const width = Math.max(key.length, cellValue.length);
      widths[i] = Math.max(widths[i] || 0, width);
    });
    return widths;
  }, {});
  
  // Apply the column widths
  worksheet['!cols'] = Object.keys(colWidths).map(i => ({ wch: colWidths[i] + 2 }));
  
  // Create a workbook with summary tab and bookings tab
  const workbook = XLSX.utils.book_new();
  
  // Add the bookings sheet
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  
  // Create a summary worksheet
  const summaryData = [
    ['Hotel Booking Report Summary'],
    ['Generated on', new Date().toLocaleDateString()],
    [''],
    ['Total Bookings', bookings.length],
    ['Total Revenue', bookings.reduce((sum, b) => sum + b.price, 0)],
    ['Average Booking Value', bookings.length ? (bookings.reduce((sum, b) => sum + b.price, 0) / bookings.length).toFixed(2) : 0],
    [''],
    ['Status Breakdown'],
    ['Status', 'Count', 'Revenue']
  ];
  
  // Calculate status breakdown
  const statusCounts = {};
  const statusRevenue = {};
  
  bookings.forEach(booking => {
    statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    statusRevenue[booking.status] = (statusRevenue[booking.status] || 0) + booking.price;
  });
  
  Object.keys(statusCounts).forEach(status => {
    summaryData.push([status, statusCounts[status], statusRevenue[status]]);
  });
  
  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Style the summary headers
  summaryWorksheet['A1'].s = { font: { bold: true, sz: 16 } };
  summaryWorksheet['A4'].s = { font: { bold: true } };
  summaryWorksheet['A5'].s = { font: { bold: true } };
  summaryWorksheet['A6'].s = { font: { bold: true } };
  summaryWorksheet['A8'].s = { font: { bold: true, underline: true } };
  
  // Add the summary as the first sheet
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
  
  // Move Summary to the first position
  workbook.SheetNames.unshift(workbook.SheetNames.pop());
  
  // Write the Excel file
  XLSX.writeFile(workbook, filename);
};

export default generateExcelReport;