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
  semester: string;
  excludeDays: string[];
  excludedTimings: string[];
}

export default function TimetablePage() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  const generateTimetables = ({ options, semester, excludeDays, excludedTimings }: GenerateTimetablesProps): void => {
    // Create Timetable objects
    const mockTimetables = options.map((option, index) => ({
      rank: index + 1,
      activities: [option],
      location: "NUS",
      freeDays: excludeDays,
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
}
