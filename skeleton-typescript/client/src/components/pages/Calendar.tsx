import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css"; 
import "./Calendar.css";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date()); // current date
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // stores clicked data

  const onChange: CalendarProps["onChange"] = (newDate, event) => {
    if (newDate instanceof Date) {
      setDate(newDate);
    } else {
      console.error('Invalid date value:', newDate);
    }
  };

  const onDateClick: CalendarProps["onClickDay"] = (value, event) => {
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div style={{ margin: "50px auto", maxWidth: "600px", textAlign: "center" }}>
      <h1>Previous Images</h1>
      <Calendar onChange={onChange} value={date} onClickDay={onDateClick} />
      <p>Selected Date: {date.toDateString()}</p>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Date Selected</h2>
            <p>{selectedDate.toDateString()}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
