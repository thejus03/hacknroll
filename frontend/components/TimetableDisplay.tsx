import React, { useState } from "react";

interface TimetableData {
  generatedURL: string;
  previewImage?: string;
}

interface TimetableDisplayProps {
  timetables: TimetableData[];
}

export default function TimetableDisplay({ timetables }: TimetableDisplayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!timetables || timetables.length === 0) {
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
        {timetables.map((timetable, index) => (
          <div
            key={index}
            className="w-11/12 max-w-xl bg-header shadow-md rounded-lg p-4 relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => window.open(timetable.generatedURL, "_blank")}
          >
            <h3 className="text-lg font-bold text-orange text-center">
              Timetable {index + 1}
            </h3>

            {/* Hover Preview */}
            {hoveredIndex === index && timetable.previewImage && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center rounded-lg z-10">
                <img
                  src={timetable.previewImage}
                  alt={`Preview for Timetable ${index + 1}`}
                  className="max-w-full max-h-full rounded-md shadow-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
