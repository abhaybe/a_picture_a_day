import React, { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "./Calendar.css";
import { get } from "../../utilities";
import { AiTwotoneFrown } from "react-icons/ai";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { isSameDay } from "date-fns";

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [serverDate, setServerDate] = useState<Date>(new Date()); // current server date
  const [winnerImage, setWinnerImage] = useState<string | undefined>(undefined);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchServerTime = async () => {
      const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
      const data = await response.json();
      const utcDate = new Date(data.utc_datetime);

      setServerDate(utcDate);
    };

    fetchServerTime();
  }, []);

  const onChange: CalendarProps["onChange"] = (newDate, event) => {
    if (newDate instanceof Date) {
      const utcDate = fromZonedTime(newDate, "America/New_York");
      setSelectedDate(utcDate);
    } else {
      console.error("Invalid date value:", newDate);
    }
  };

  const onDateClick: CalendarProps["onClickDay"] = (value, event) => {
    value = fromZonedTime(value, "America/New_York");
    get("/api/get-winner", { date: value })
      .then((info) => {
        setWinnerImage(info.image.signedUrl);
        setPrompt(info.prompt);
      })
      .catch(() => {
        setWinnerImage(undefined);
        setPrompt(undefined);
      });

    get("/api/get-image", { date: value })
      .then((info) => {
        setUserImage(info.image.signedUrl);
      })
      .catch(() => {
        setUserImage(undefined);
      });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="calendar-container">
      <h1>Past Images</h1>
      <Calendar
        onChange={onChange}
        value={toZonedTime(selectedDate, "America/New_York")}
        onClickDay={onDateClick}
        tileClassName={({ date, view }) => {
          if (
            view === "month" &&
            serverDate &&
            isSameDay(date, toZonedTime(serverDate, "America/New_York"))
          ) {
            // console.log("CHEEZBUGGA");
            // console.log(
            //   date,
            //   toZonedTime(date, "America/New_York"),
            //   fromZonedTime(date, "America/New_York"),
            //   serverDate,
            //   toZonedTime(serverDate, "America/New_York"),
            //   fromZonedTime(serverDate, "America/New_York")
            // );
            return "highlight-today";
          }
          return null;
        }}
      />
      <p>Selected Date: {selectedDate.toDateString()}</p>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {prompt !== undefined ? (
              <h1>{prompt}</h1>
            ) : (
              <h1>
                Nobody Winner <AiTwotoneFrown />
              </h1>
            )}
            <div className="image-container">
              <div className="image-wrapper">
                {winnerImage !== undefined ? (
                  <img src={winnerImage} alt="winner image" className="image_scaled" />
                ) : (
                  <p className="missing-image-text">No winner on this date.</p>
                )}
                <p className="image-label">Winner</p>
              </div>
              <div className="image-wrapper">
                {userImage !== undefined ? (
                  <img src={userImage} alt="your image" className="image_scaled" />
                ) : (
                  <p className="missing-image-text">No submission on this date.</p>
                )}
                <p className="image-label">Your Submission</p>
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
