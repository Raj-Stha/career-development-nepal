"use client";
import { useEffect, useState } from "react";

export default function CurrentTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const day = now.toLocaleDateString(undefined, { weekday: "long" }); // Wednesday
  const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`; // 7-23-2025
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }); // 10:38

  return (
    <div className="poppins-text text-left leading-tight text-sm lg:text-base text-[#003366] font-medium space-y-1">
      <div>{day}</div>
      <div>
        {date} | {time}
      </div>
    </div>
  );
}
