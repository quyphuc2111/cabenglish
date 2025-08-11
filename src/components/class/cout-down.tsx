"use client";
import { useState, useEffect } from "react";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface CountdownTimerProps {
  targetDate: string | Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    // Chỉ update khi tab đang active để giảm CPU
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    // Pause timer khi tab không active
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeLeft(calculateTimeLeft());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [targetDate]);

  return (
    <div>
      {timeLeft.days !== undefined ? (
        <div className="text-red-500 text-xs md:text-sm">
          <span>{`${timeLeft.hours}h : ${timeLeft.minutes}m : ${timeLeft.seconds}s `}</span>
        </div>
      ) : (
        <span>Time&apos;s up!</span>
      )}
    </div>
  );
};

export default CountdownTimer;
