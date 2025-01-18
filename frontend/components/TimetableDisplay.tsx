import { useState } from "react";

type Timetable = {
  rank: number;
  activities?: string[];
  location?: string;
  freeDays?: string[];
  unfavorableTimings?: string;
};

type TimetableDisplayProps = {
  timetables: Timetable[];
};

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
            <h3 className="text-lg font-bold text-orange">Rank #{timetable.rank}</h3>
            <p className="text-gray-300 mt-2">
              Activities: {Array.isArray(timetable.activities) && timetable.activities.length > 0
                ? timetable.activities.join(", ")
                : "No activities specified"}
            </p>
            <p className="text-gray-300">Location: {timetable.location || "Not specified"}</p>
            <p className="text-gray-300">
              Days Off: {Array.isArray(timetable.freeDays) && timetable.freeDays.length > 0
                ? timetable.freeDays.join(", ")
                : "None"}
            </p>
            <p className="text-gray-300">
              Unfavorable Timings: {timetable.unfavorableTimings || "None"}
            </p>

            {/* Hover Preview */}
            {hoveredTimetable === timetable && (
              <div className="absolute top-0 right-[-260px] bg-header p-6 shadow-lg rounded-lg w-64 animate-fade-in z-10">
                <h3 className="text-xl font-bold text-orange mb-2">Timetable Preview</h3>
                <p className="text-gray-300 whitespace-pre-line">
                  <strong>Activities:</strong> {Array.isArray(timetable.activities) && timetable.activities.length > 0
                    ? timetable.activities.join(", ")
                    : "No activities specified"}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Location:</strong> {timetable.location || "Not specified"}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Days Off:</strong> {Array.isArray(timetable.freeDays) && timetable.freeDays.length > 0
                    ? timetable.freeDays.join(", ")
                    : "None"}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong>Unfavorable Timings:</strong> {timetable.unfavorableTimings || "None"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
