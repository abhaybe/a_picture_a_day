import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "./Calendar.css";
import { startOfDay, endOfDay } from "date-fns";

import { get } from "../../utilities";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date()); // current date
  const [winnerImage, setWinnerImage] = useState<string | undefined>(undefined);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // stores clicked data

  const onChange: CalendarProps["onChange"] = (newDate, event) => {
    if (newDate instanceof Date) {
      setDate(newDate);
    } else {
      console.error("Invalid date value:", newDate);
    }
  };

  const onDateClick: CalendarProps["onClickDay"] = (value, event) => {
    setSelectedDate(value);
    console.log(startOfDay(value));
    get("/api/get-winner", { date: value })
      .then((info) => {
        setWinnerImage(info.image.signedUrl);
      })
      .then(() => setIsModalOpen(true));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <div className="calendar-container">
      <h1>Previous Images</h1>
      <Calendar onChange={onChange} value={date} onClickDay={onDateClick} />
      <p>Selected Date: {date.toDateString()}</p>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>Images for {selectedDate.toDateString()}</h1>
            <div className="image-container">
              <div className="image-wrapper">
                winner
                <img src={winnerImage} alt="winner image" />
              </div>
              <div className="image-wrapper">
                yours
                <img src="path-to-image-2" alt="Image 2" />
              </div>
            </div>
            <div className="bottom-content">
              <p>{selectedDate.toDateString()}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
