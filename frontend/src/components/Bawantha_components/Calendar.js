import React, { useState } from 'react';

const Calendar = ({ onDateSelect, selectedDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getDaysArray = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() || 7;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;
  };

  const isBooked = (day) => {
    if (!day) return false;
    const formatted = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return selectedDates.includes(formatted);
  };

  const handleClickDate = (day) => {
    if (!day) return;
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const days = getDaysArray();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg w-full border border-gray-200">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm transition"
        >
          &lt;
        </button>
        <h3 className="font-bold text-lg text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm transition"
        >
          &gt;
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((day, index) => {
          const today = isToday(day);
          const booked = isBooked(day);

          return (
            <div
              key={index}
              onClick={() => handleClickDate(day)}
              className={`flex items-center justify-center h-6 w-6 rounded-full cursor-pointer
                ${!day ? 'invisible' : ''}
                ${today ? 'bg-blue-500 text-white font-bold' : ''}
                ${booked ? 'bg-yellow-400 text-white font-semibold' : ''}
                ${!today && !booked ? 'hover:bg-gray-100 text-gray-700' : ''}
                transition-all duration-300 ease-in-out`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
