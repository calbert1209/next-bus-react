import { FC, useEffect, useRef, useState } from "react";

export const CurrentTime: FC = () => {
  const timer = useRef(-1);
  const [time, setTime] = useState<[string, string]>(["--", "--"]);

  useEffect(() => {
    timer.current = window.setInterval(() => {
      const now = new Date();
      const formatted = Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      const nextTime = formatted.split(":");
      setTime([nextTime[0], nextTime[1]]);
    }, 500);

    return () => {
      window.clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="currentTime">
      <span>{time[0]}</span>
      <span className="currentTimeColon">{":"}</span>
      <span>{time[1]}</span>
    </div>
  );
};
