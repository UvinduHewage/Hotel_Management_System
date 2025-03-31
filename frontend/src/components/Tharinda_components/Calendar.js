import React, { useState } from 'react';

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Day names for header
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay() || 7; // Convert Sunday (0) to 7 for easier calculation
  };
  
  // Handle date selection
  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newSelectedDate);
    if (onDateSelect) {
      onDateSelect(newSelectedDate);
    }
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Create array for all days in the month plus empty spots for alignment
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 1; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    // Return calendar grid rows
    const rows = [];
    let cells = [];
    
    days.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        rows.push(cells);
        cells = [];
      }
      
      cells.push(day);
      
      if (index === days.length - 1) {
        // Push the last row
        rows.push(cells);
      }
    });
    
    return rows;
  };
  
  // Check if a day is selected
  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };
  
  // Check if a day is today
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="bg-white rounded-lg p-1 shadow-sm w-full text-xs">
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-700 text-xs px-1">
          &lt;
        </button>
        <h3 className="font-medium text-center text-xs">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-700 text-xs px-1">
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {/* Day names header */}
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-xs font-medium text-gray-500 py-1">
            {dayName}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map((day, dayIndex) => (
              <div 
                key={`day-${dayIndex}`} 
                className={`text-center p-2 text-xs cursor-pointer ${
                  !day ? 'invisible' : ''
                } ${
                  isSelected(day) 
                    ? 'bg-blue-500 text-white rounded-full' 
                    : isToday(day)
                    ? 'bg-blue-100 rounded-full'
                    : 'hover:bg-gray-100 rounded-full'
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;