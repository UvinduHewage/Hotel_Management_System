import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF Styles with enhanced professional appearance
const styles = StyleSheet.create({
  page: { 
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1E40AF',
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 10,
    color: '#6B7280'
  },
  logo: {
    width: 60,
    height: 60
  },
  title: { 
    fontSize: 24, 
    marginBottom: 15, 
    fontWeight: 'bold', 
    color: '#1E3A8A',
    textAlign: 'left'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#4B5563'
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB'
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: '30%',
    fontSize: 10,
    color: '#4B5563',
    fontWeight: 'bold'
  },
  infoValue: {
    width: '70%',
    fontSize: 10,
    color: '#1F2937'
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 14, 
    marginBottom: 10, 
    fontWeight: 'bold',
    backgroundColor: '#EFF6FF',
    padding: 8,
    color: '#1E40AF',
    borderRadius: 3
  },
  statsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 5
  },
  statItem: { 
    width: '33%', 
    padding: 5, 
    marginBottom: 10 
  },
  statLabel: { 
    fontSize: 9, 
    color: '#6B7280' 
  },
  statValue: { 
    fontSize: 12, 
    fontWeight: 'bold',
    color: '#1F2937'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 5,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 1
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontSize: 9,
    backgroundColor: '#F9FAFB'
  },
  tableRowAlternate: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontSize: 9,
    backgroundColor: '#FFFFFF'
  },
  cell: { 
    flex: 1,
    textAlign: 'left'
  },
  cellLarge: { 
    flex: 2,
    textAlign: 'left'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#6B7280'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
  },
  summaryBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6'
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E40AF'
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A'
  }
});

// Status badge styles by status type
const getStatusStyle = (status) => {
  switch(status.toLowerCase()) {
    case 'checked-in':
      return { color: '#065F46', backgroundColor: '#D1FAE5' };
    case 'booked':
      return { color: '#9A3412', backgroundColor: '#FEF3C7' };
    case 'completed':
      return { color: '#1E40AF', backgroundColor: '#DBEAFE' };
    case 'cancelled':
      return { color: '#991B1B', backgroundColor: '#FEE2E2' };
    default:
      return { color: '#1F2937', backgroundColor: '#F3F4F6' };
  }
};

// Enhanced Professional PDF Report Component
const BookingReport = ({ 
  bookings, 
  stats, 
  startDate, 
  endDate, 
  title = "Guest Management Report",
  hotelName = "Grand Horizon Hotel & Resort",
  hotelAddress = "No. 45 Beachside Road, Galle, Southern Province, Sri Lanka",
  hotelContact = "+94 91 223 4567",
  hotelEmail = "info@grandplaza.com",
  logoSrc = null
}) => {
  // Calculate some additional stats for the report
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const averageRevenue = bookings.length ? (totalRevenue / bookings.length).toFixed(2) : 0;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{hotelName}</Text>
            <Text style={styles.headerText}>{hotelAddress}</Text>
            <Text style={styles.headerText}>{hotelContact} | {hotelEmail}</Text>
          </View>
          {logoSrc && <Image style={styles.logo} src={logoSrc} />}
        </View>
        
        {/* Report Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Period:</Text>
            <Text style={styles.infoValue}>{startDate} to {endDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Generated:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Bookings:</Text>
            <Text style={styles.infoValue}>{bookings.length}</Text>
          </View>
        </View>
        
        {/* Revenue Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Revenue</Text>
          <Text style={styles.summaryValue}>LKR {totalRevenue.toLocaleString()}</Text>
          <Text style={styles.headerText}>Average Revenue per Booking: LKR {averageRevenue}</Text>
        </View>
        
        {/* Dashboard Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsContainer}>
            {Object.entries(stats).map(([key, value], index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                <Text style={styles.statValue}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.cellLarge}>Guest</Text>
            <Text style={styles.cell}>Room</Text>
            <Text style={styles.cell}>Check In</Text>
            <Text style={styles.cell}>Check Out</Text>
            <Text style={styles.cell}>Status</Text>
            <Text style={styles.cell}>Amount</Text>
          </View>
          {bookings.map((booking, index) => {
            const statusStyle = getStatusStyle(booking.status);
            
            return (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                <Text style={styles.cellLarge}>{booking.customerName}</Text>
                <Text style={styles.cell}>#{booking.roomNumber}</Text>
                <Text style={styles.cell}>{new Date(booking.checkInDate).toLocaleDateString()}</Text>
                <Text style={styles.cell}>{new Date(booking.checkOutDate).toLocaleDateString()}</Text>
                <Text style={{
                  ...styles.cell,
                  color: statusStyle.color,
                  backgroundColor: statusStyle.backgroundColor,
                  padding: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                }}>
                  {booking.status}
                </Text>
                <Text style={styles.cell}>LKR {booking.price.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>{hotelName} - Confidential Report</Text>
          <Text>Generated by Hotel Management System</Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default BookingReport;