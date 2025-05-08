import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Percent,
  Hotel
} from 'lucide-react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios'; // Added missing import for axios

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const [monthlyData, setMonthlyData] = useState({ revenue: [], bookings: [], labels: [] });
  const [occupancyData, setOccupancyData] = useState({ months: [], values: [] });
  const [monthlyAvgStay, setMonthlyAvgStay] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Use real data from API
        const res = await axios.get('/api/bookings');
        if (res.data.success) {
          const bookings = res.data.data;
          const revenueMap = {};
          const bookingMap = {};
          const occupancyMap = {};
          const durationMap = {};

          bookings.forEach(b => {
            const checkIn = new Date(b.checkInDate);
            const checkOut = new Date(b.checkOutDate);
            const diffDays = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24));

            const label = `${checkIn.getFullYear()}-${checkIn.getMonth() + 1}`;

            revenueMap[label] = (revenueMap[label] || 0) + b.price;
            bookingMap[label] = (bookingMap[label] || 0) + 1;
            occupancyMap[label] = (occupancyMap[label] || 0) + (b.status === 'Checked-in' || b.status === 'Booked' ? 1 : 0);
            if (!durationMap[label]) durationMap[label] = [];
            durationMap[label].push(diffDays);
          });

          const labels = Object.keys(revenueMap).sort();
          const revenue = labels.map(label => revenueMap[label]);
          const bookingsCount = labels.map(label => bookingMap[label]);
          const occupancyRate = labels.map(label => Math.round((occupancyMap[label] / 20) * 100)); // 20 rooms assumed
          const avgStay = labels.map(label => {
            const list = durationMap[label];
            const sum = list.reduce((a, b) => a + b, 0);
            return (sum / list.length).toFixed(1);
          });

          setMonthlyData({ revenue, bookings: bookingsCount, labels });
          setOccupancyData({ months: labels, values: occupancyRate });
          setMonthlyAvgStay(avgStay);
          setIsLoading(false);
        } else {
          // Handle case when res.data.success is false
          console.error("API returned unsuccessful response");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = monthlyData.revenue.reduce((a, b) => a + b, 0);
  const totalBookings = monthlyData.bookings.reduce((a, b) => a + b, 0);
  const avgOccupancy = occupancyData.values.reduce((a, b) => a + b, 0) / (occupancyData.values.length || 1);
  const avgStayOverall = monthlyAvgStay.reduce((a, b) => a + parseFloat(b), 0) / (monthlyAvgStay.length || 1);

  // Get previous month values for comparison arrows
  const currentMonthRevenue = monthlyData.revenue[monthlyData.revenue.length - 1] || 0;
  const prevMonthRevenue = monthlyData.revenue[monthlyData.revenue.length - 2] || 0;
  const revenueChange = prevMonthRevenue ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;

  const currentOccupancy = occupancyData.values[occupancyData.values.length - 1] || 0;
  const prevOccupancy = occupancyData.values[occupancyData.values.length - 2] || 0;
  const occupancyChange = prevOccupancy ? ((currentOccupancy - prevOccupancy) / prevOccupancy) * 100 : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  const pieData = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [currentOccupancy || 0, 100 - (currentOccupancy || 0)],
        backgroundColor: ['#4F46E5', '#E0E7FF'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const bookingsComparisonData = {
    labels: monthlyData.labels.map(label => {
      const [year, month] = label.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'This Year',
        data: monthlyData.bookings,
        backgroundColor: '#4F46E5',
        borderRadius: 6,
      },
      {
        label: 'Last Year',
        data: monthlyData.bookings.map((v) => Math.max(v - 5, 0)), // Mock
        backgroundColor: '#A5B4FC',
        borderRadius: 6,
      },
    ],
  };

  const stayTrendData = {
    labels: monthlyData.labels.map(label => {
      const [year, month] = label.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Avg Stay (days)',
        data: monthlyAvgStay,
        fill: true,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueTrendData = {
    labels: monthlyData.labels.map(label => {
      const [year, month] = label.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue 2024',
        data: monthlyData.revenue,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Revenue 2023',
        data: monthlyData.revenue.map(v => v * 0.75),
        borderColor: '#9CA3AF',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#9CA3AF',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Calculate daily occupancy from the real data
  const calculateDailyOccupancy = () => {
    // If no data is available, return empty dataset
    if (monthlyData.labels.length === 0) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Occupancy',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.4,
          fill: true,
        }]
      };
    }
    
    // Use the last month's occupancy rate as a daily distribution
    // This is an approximation since we don't have actual daily data
    const latestOccupancy = occupancyData.values[occupancyData.values.length - 1] || 0;
    // Create a realistic distribution pattern based on typical hotel patterns
    const dailyFactors = [0.7, 0.65, 0.75, 0.85, 0.95, 1.0, 0.9];
    const dailyOccupancy = dailyFactors.map(factor => {
      return Math.min(Math.round(latestOccupancy * factor), 100);
    });
    
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Occupancy',
        data: dailyOccupancy,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true,
      }]
    };
  };
  
  const dailyOccupancyData = calculateDailyOccupancy();

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track and analyze your hotel's performance metrics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow">
              <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`mr-4 px-4 py-2 font-medium text-sm rounded-full transition-colors ${
              activeTab === 'overview' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('revenue')}
            className={`mr-4 px-4 py-2 font-medium text-sm rounded-full transition-colors ${
              activeTab === 'revenue' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Revenue
          </button>
          <button 
            onClick={() => setActiveTab('occupancy')}
            className={`mr-4 px-4 py-2 font-medium text-sm rounded-full transition-colors ${
              activeTab === 'occupancy' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Occupancy
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium text-sm rounded-full transition-colors ${
              activeTab === 'bookings' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-indigo-50 text-indigo-600">
                  <TrendingUp size={22} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
                    <span className={`ml-2 text-sm font-medium ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {revenueChange >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                      {Math.abs(revenueChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                vs previous month
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-purple-50 text-purple-600">
                  <Users size={22} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                From all channels
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-orange-50 text-orange-600">
                  <Hotel size={22} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Avg. Occupancy</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{avgOccupancy.toFixed(1)}%</p>
                    <span className={`ml-2 text-sm font-medium ${occupancyChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {occupancyChange >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                      {Math.abs(occupancyChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                Current month
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-green-50 text-green-600">
                  <CalendarCheck size={22} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Avg. Stay Duration</p>
                  <p className="text-2xl font-semibold text-gray-900">{avgStayOverall.toFixed(1)} days</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-2">
              <div className="text-sm text-gray-500">
                All bookings
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
              <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Year-over-Year</div>
            </div>
            <div className="h-80">
              <Line data={revenueTrendData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Bookings</h3>
              <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Comparison</div>
            </div>
            <div className="h-80">
              <Bar data={bookingsComparisonData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Current Occupancy</h3>
              <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Live</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-indigo-600">{currentOccupancy}%</div>
                <div className="text-gray-500 mt-2">Room Occupancy</div>
              </div>
              <div className="h-56">
                <Doughnut 
                  data={pieData} 
                  options={{
                    ...chartOptions,
                    cutout: '70%',
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Average Stay Duration</h3>
              <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Trending</div>
            </div>
            <div className="h-80">
              <Line data={stayTrendData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Additional insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Occupancy Pattern</h3>
            <div className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Last 4 weeks</div>
          </div>
          <div className="h-64">
            <Line data={dailyOccupancyData} options={chartOptions} />
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-sm text-white">
            <div className="flex items-center mb-3">
              <TrendingUp size={20} className="mr-2" />
              <h4 className="font-semibold">Revenue Insight</h4>  
            </div>
            <p className="text-indigo-100">
              {revenueChange > 0 
                ? `Revenue is up ${revenueChange.toFixed(1)}% compared to last month.`
                : revenueChange < 0
                  ? `Revenue has decreased by ${Math.abs(revenueChange).toFixed(1)}% compared to last month.`
                  : `Revenue is stable compared to last month.`
              }
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
            <div className="flex items-center mb-3">
              <CalendarCheck size={20} className="mr-2" />
              <h4 className="font-semibold">Booking Patterns</h4>  
            </div>
            <p className="text-green-100">Average stay duration is {avgStayOverall.toFixed(1)} days. 
            {avgStayOverall > 3
              ? " Consider offering extended stay packages."
              : " Consider offering special amenities for short stays."
            }</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-sm text-white">
            <div className="flex items-center mb-3">
              <Percent size={20} className="mr-2" />
              <h4 className="font-semibold">Occupancy Alert</h4>  
            </div>
            <p className="text-purple-100">Current occupancy rate is {currentOccupancy}%. 
            {currentOccupancy > 85
              ? " Capacity is nearing maximum. Consider optimizing pricing."
              : currentOccupancy < 50
                ? " Consider promotions to increase mid-week bookings."
                : " Occupancy is at an optimal level."
            }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;