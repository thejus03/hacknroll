import React from "react";
import { useAutoPreview } from "../../app/hooks/useAutoPreview";
import { demoData } from "../../app/lib/demoData";

const AutoLivePreview: React.FC = () => {
  const currentTimetable = useAutoPreview(demoData.timetables, 5000); // Switch every 5 seconds

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["0900", "1000", "1100", "1200", "1300", "1400", "1500", "1600"];

  if (!currentTimetable || !currentTimetable.lessons) {
    return <div className="text-gray-300">Loading Timetable...</div>;
  }

  return (
    <div className="bg-mainbg text-white p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-orange mb-4">Timetable AI Auto Preview</h2>
      <p className="text-gray-300 mb-6">{`Scenario: ${currentTimetable.name} - ${currentTimetable.conditions}`}</p>

      {/* Timetable Grid */}
      <div className="overflow-x-auto border border-gray-600 rounded-md">
        <table className="w-full border-collapse table-fixed">
            <thead>
            <tr>
                <th className="py-4 px-4 text-gray-400 text-left">Days</th>
                {timeSlots.map((time) => (
                <th key={time} className="py-4 px-4 text-gray-400">{time}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {daysOfWeek.map((day) => (
                <tr key={day} className="border-t border-gray-600">
                <td className="py-4 px-4 text-gray-300">{day}</td>
                {timeSlots.map((time) => {
                    const lesson = currentTimetable.lessons.find(
                    (l) => l.day === day && l.startTime === time
                    );

                    return (
                    <td key={time} className="py-2 px-4 h-20 border border-gray-600">
                        {lesson ? (
                        <div
                            className={`flex items-center justify-center rounded-md text-sm p-4 text-black ${lesson.color}`}
                        >
                            <div className="text-center">
                            <p className="font-bold">{lesson.moduleCode}</p>
                            <p className="text-xs">{lesson.lessonType}</p>
                            <p className="text-xs">{lesson.venue}</p>
                            </div>
                        </div>
                        ) : (
                        <div className="h-full"></div>
                        )}
                    </td>
                    );
                })}
                </tr>
            ))}
            </tbody>
        </table>
        </div>


      {/* Exams Section */}
      <h3 className="text-lg font-bold text-orange mt-8 mb-4">Modules</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTimetable.exams.map((exam, index) => (
          <div
            key={index}
            className={`p-4 rounded-md shadow-md text-black ${exam.color}`}
          >
            <h4 className="text-md font-bold">{exam.moduleCode}</h4>
            <p className="text-sm">{exam.moduleName}</p>
            <p className="text-xs">{exam.examDate}</p>
            <p className="text-xs">{exam.duration} • {exam.units} Units</p>
          </div>
        ))}
      </div>

      <div className="text-gray-300 mt-4">Total Units: 20 Units</div>
    </div>
  );
};

export default AutoLivePreview;
