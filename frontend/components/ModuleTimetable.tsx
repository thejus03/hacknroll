// src/components/ModuleTimetable.tsx

import React, { useState } from "react";
import { fetchModuleTimetable } from "../services/NUSModsAPI";
import { SemesterTimetable } from "../types/NUSMods";

interface Props {
  acadYear: string;
  onAddModule: (moduleCode: string, timetable: SemesterTimetable[]) => void; // Callback to add timetable data to parent
}

const ModuleTimetable: React.FC<Props> = ({ acadYear, onAddModule }) => {
  const [moduleCode, setModuleCode] = useState<string>("");
  const [timetable, setTimetable] = useState<SemesterTimetable[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchTimetable = async () => {
    try {
      setError(null); // Clear previous errors
      const data = await fetchModuleTimetable(acadYear, moduleCode);
      setTimetable(data);
      onAddModule(moduleCode, data); // Pass timetable data to parent
    } catch (err) {
      setError("Failed to fetch timetable. Please check the module code.");
      setTimetable(null);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-bold mb-4">Add NUSMods Module</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={moduleCode}
          onChange={(e) => setModuleCode(e.target.value)}
          placeholder="Enter Module Code (e.g., CS2030S)"
          className="p-2 rounded w-72"
        />
        <button
          onClick={handleFetchTimetable}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {timetable && (
        <div className="mt-4">
          <h4 className="font-bold">Timetable</h4>
          {timetable.map((sem) => (
            <div key={sem.semester}>
              <h5 className="font-bold">Semester {sem.semester}</h5>
              <ul>
                {sem.lessons.map((lesson, idx) => (
                  <li key={idx}>
                    {lesson.day} | {lesson.startTime} - {lesson.endTime} |{" "}
                    {lesson.lessonType} | {lesson.venue}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleTimetable;
