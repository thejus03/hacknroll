"use client";
import { useState } from "react";
import TimetableForm from "@/components/TimetableForm";
import TimetableDisplay from "@/components/TimetableDisplay";

interface Activity {
  activity: string;
  duration: number;
  priority: number;
}

interface Timetable {
  rank: number;
  timetable: string;
  details: string;
}

export default function TimetablePage() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  const generateTimetables = ({
    activities,
    location,
    excludeDays,
    excludedTimings,
  }: {
    activities: Activity[];
    location: string;
    excludeDays: string[];
    excludedTimings: string[];
  }) => {
    const mockTimetables = activities.map((activity, index) => ({
      rank: index + 1,
      timetable: `${activity.activity} - ${activity.duration} mins, Priority: ${activity.priority}`,
      details: `
        Activity: ${activity.activity}
        Priority: ${activity.priority}
        Duration: ${activity.duration} minutes
        Location: ${location}
        Excluded Days: ${excludeDays.join(", ")}
        Unfavorable Timings: ${excludedTimings.join(", ")}
      `,
    }));
    setTimetables(mockTimetables);
  };
}   
