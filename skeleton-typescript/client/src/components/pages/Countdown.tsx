import React, { useState, useEffect } from "react";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { set } from "date-fns";

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = fromZonedTime(
        set(new Date(), {
          hours: 23,
          minutes: 59,
          seconds: 59,
          milliseconds: 999,
        }),
        "America/New_York"
      );
      const difference = nextMidnight.getTime() - now.getTime();

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <h2>Time Left: {timeLeft}</h2>
    </div>
  );
};

export default CountdownTimer;
