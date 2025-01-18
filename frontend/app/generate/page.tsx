"use client";
import { useState } from "react";
import TimetableForm from "../../components/TimetableForm";
import TimetableDisplay from "../../components/TimetableDisplay";

export default function TimetablePage() {
  const [timetables, setTimetables] = useState([]);

  const generateTimetables = ({ activities }) => {
    const mockTimetables = activities.map((activity, index) => ({
      rank: index + 1,
      timetable: `${activity.activity} - ${activity.duration} mins, Priority: ${activity.priority}`,
      details: `
        Activity: ${activity.activity}
        Priority: ${activity.priority}
        Duration: ${activity.duration} minutes
      `,
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
