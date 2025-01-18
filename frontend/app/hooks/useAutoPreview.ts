import { useState, useEffect } from "react";

/**
 * Custom hook to cycle through timetables at a fixed interval.
 * @param timetables Array of timetables to cycle through.
 * @param interval Duration (in milliseconds) for each cycle.
 * @returns The current timetable being previewed.
 */
export const useAutoPreview = (timetables: any[], interval: number = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Ensure there are timetables to cycle through
    if (timetables.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % timetables.length);
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timetables, interval]);

  return timetables[currentIndex]; // Return the currently active timetable
};
