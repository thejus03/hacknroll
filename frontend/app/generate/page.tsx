"use client";
import { useState } from "react";
import TimetableForm from "../../components/TimetableForm";
import TimetableDisplay from "../../components/TimetableDisplay";

interface Timetable {
  rank: number;
  activities: string[];
  location: string;
  freeDays: string[];
  unfavorableTimings: string;
}

interface GenerateTimetablesProps {
  options: string[];
  semester: number;
  excludeDays: string[];
  excludedTimings: string[];
}

const TimetablePage = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  const generateTimetables = ({ options, semester, excludeDays, excludedTimings }: GenerateTimetablesProps): void => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const freeDays = daysOfWeek.filter(day => !excludeDays.includes(day));

    // Create Timetable objects
    const mockTimetables = options.map((option, index) => ({
      rank: index + 1,
      activities: [option],
      location: "NUS",
      freeDays: freeDays,
      unfavorableTimings: excludedTimings.join(", "),
    }));
    setTimetables(mockTimetables);
  };

  return (
    <div className="min-h-screen bg-mainbg text-white">
      <div className="flex flex-row gap-4 px-6 py-10">
        <div className="w-1/3">
          <TimetableForm onGenerate={generateTimetables} />
        </div>
        <div className="w-2/3">
          <TimetableDisplay timetables={timetables} />
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
