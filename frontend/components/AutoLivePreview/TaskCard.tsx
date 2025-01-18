import React from "react";

interface TaskCardProps {
  task: {
    moduleCode: string;
    lessonType: string;
    day: string;
    startTime: string;
    endTime: string;
    venue: string;
  };
  isActive: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isActive }) => {
  return (
    <div
      className={`p-4 rounded-md shadow-lg transition-all duration-500 ${
        isActive ? "bg-orange text-white" : "bg-header text-gray-300"
      }`}
    >
      <h4 className="text-lg font-bold">{task.moduleCode}</h4>
      <p className="text-sm">{task.lessonType}</p>
      <p className="text-sm">{task.day}</p>
      <p className="text-sm">
        {task.startTime} - {task.endTime}
      </p>
      <p className="text-sm">{task.venue}</p>
    </div>
  );
};

export default TaskCard;
