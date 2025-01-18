import { useState } from "react";

interface Timetable {
  rank: number;
  mods?: string[];
  freeDays?: string[];
  earliestTime?: string;
  latestTime?: string;
}

interface TimetableDisplayProps {
  timetables: Timetable[];
}

// Timetable Display Component
export default function TimetableDisplay({ timetables }: TimetableDisplayProps) {
  const [hoveredTimetable, setHoveredTimetable] = useState<Timetable | null>(null);

  // No timetables displayed
  if (!timetables || timetables.length === 0) {
    return (
      <div className="w-full md:w-2/3 p-6 flex justify-center items-center">
        <h2 className="text-lg text-gray-400">
          No timetables generated yet. Start by entering criteria!
        </h2>
      </div>
    );
  }

  // Display timetables
  return (
    <div className="w-full md:w-2/3 bg-mainbg p-6 rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-orange mb-6 text-center">
        Generated Timetables
      </h2>
      <div className="space-y-4">
        {timetables.map((timetable, index) => (
          <div
            key={index}
            className="bg-header shadow-md rounded-lg p-4 hover:scale-105 transition-transform duration-300 relative"
            onMouseEnter={() => setHoveredTimetable(timetable)}
            onMouseLeave={() => setHoveredTimetable(null)}
          >
            <h3 className="text-lg font-bold text-orange">
              Rank #{timetable.rank}
            </h3>
            <p className="text-gray-300 mt-2">
              Modules: {Array.isArray(timetable.mods) && timetable.mods.length > 0
                ? timetable.mods.join(", ")
                : "No modules specified"}
            </p>
            <p className="text-gray-300">
              Days: {Array.isArray(timetable.freeDays) && timetable.freeDays.length > 0
                ? timetable.freeDays.join(", ")
                : "None"}
            </p>
            <p className="text-gray-300">
              Time: {timetable.earliestTime || "N/A"} to {timetable.latestTime || "N/A"}
            </p>

            {/* Hover Preview */}
            {hoveredTimetable === timetable && (
              <div className="absolute top-0 right-[-260px] bg-header p-6 shadow-lg rounded-lg w-64 animate-fade-in z-10">
                <h3 className="text-xl font-bold text-orange mb-2">
                  Timetable Preview
                </h3>
                <p className="text-gray-300 whitespace-pre-line">
                  <strong>Modules:</strong>{" "}
                  {Array.isArray(timetable.mods) && timetable.mods.length > 0
                    ? timetable.mods.join(", ")
                    : "No modules specified"}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Days:</strong>{" "}
                  {Array.isArray(timetable.freeDays) && timetable.freeDays.length > 0
                    ? timetable.freeDays.join(", ")
                    : "None"}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Time:</strong> {timetable.earliestTime || "N/A"} to {timetable.latestTime || "N/A"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
