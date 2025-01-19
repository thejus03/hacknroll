import { link } from "fs";
import React, { useState } from "react";

interface TimetableDisplayProps {
  linkArrayPool: string[]; // Expecting an array of URLs (strings)
}

export default function TimetableDisplay({ linkArrayPool }: TimetableDisplayProps) {
  console.log("Link:", linkArrayPool);
  const [hovered, setHovered] = useState(false); // Manage hover state

  if (!linkArrayPool || linkArrayPool.length === 0) {
    return (
      <div className="w-full min-h-screen p-6 flex justify-center items-center">
        <h2 className="text-lg text-gray-400">
          No timetables generated yet. Start by entering criteria!
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-mainbg p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-orange mb-6 text-center">
        Generated Timetables
      </h2>
      <div className="flex flex-col items-center w-full space-y-6">
        {linkArrayPool.map((url, index) => (
          <div
            key={index}
            className="w-full max-w-3xl bg-header shadow-md rounded-lg p-6 relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <h3 className="text-lg font-bold text-orange text-center mb-4">
              Timetable {index + 1}
            </h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-white underline hover:text-orange transition-colors duration-200 text-center"
            >
              View Timetable
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
