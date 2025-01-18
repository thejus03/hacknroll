"use client";
import { useState, useEffect, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

// Helper function to check if two time ranges overlap
const timeRangesOverlap = (userRange: string, activityRange: string) => {
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map((str) => str.padStart(2, "0"));
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const [userStart, userEnd] = userRange.split(" - ").map(parseTime);
  const [activityStart, activityEnd] = activityRange.split(" - ").map(parseTime);

  return userStart < activityEnd && activityStart < userEnd;
};

export default function TimetableForm({ onGenerate }: { onGenerate: Function }) {
  const [query, setQuery] = useState(""); // For dropdown search bar
  const [selectedActivities, setSelectedActivities] = useState<any[]>([]); // To store selected activities
  const [location, setLocation] = useState(""); // For location input
  const [excludeDays, setExcludeDays] = useState<string[]>([]); // For excluded days
  const [excludedTimings, setExcludedTimings] = useState<string[]>([]); // For excluded timings
  const [popupMessage, setPopupMessage] = useState(""); // For conflict popup messages
  const [currentStartTime, setCurrentStartTime] = useState("07:00");
  const [currentEndTime, setCurrentEndTime] = useState("08:00");
  const [isFocused, setIsFocused] = useState(false);
  const [options, setOptions] = useState<any[]>([]); // Store options fetched from the server

  

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch options from server (mock or API endpoint)
  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllMods", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setOptions(data.payload);
      
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const filteredOptions = options
    .filter((option: any) =>
      option.moduleCode.toUpperCase().includes(query.toUpperCase())
    )
    .slice(0, 5);

  const handleAddActivity = (activityObj: any) => {
    setSelectedActivities([...selectedActivities, activityObj]);
    setQuery(""); // Clear the search query
  };

  const handleRemoveActivity = (index: number) => {
    setSelectedActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };

  const toggleExcludeDay = (day: string) => {
    const newExcludedDays = excludeDays.includes(day)
      ? excludeDays.filter((d) => d !== day) // Remove the day if already excluded
      : [...excludeDays, day]; // Add the day to exclude

    const conflicts = selectedActivities.some((activity) =>
      activity.availableDays?.every((availableDay: string) => newExcludedDays.includes(availableDay))
    );

    if (conflicts) {
      const conflictingActivities = selectedActivities.filter((activity) =>
        activity.availableDays?.every((availableDay: string) => newExcludedDays.includes(availableDay))
      );
      setPopupMessage(
        `You cannot exclude ${day} as it conflicts with: ${conflictingActivities
          .map((a) => a.activity)
          .join(", ")}.`
      );
      setTimeout(() => setPopupMessage(""), 3000); // Remove popup after 3 seconds
    } else {
      setPopupMessage(""); // Clear any popup messages
      setExcludeDays(newExcludedDays); // Update the excluded days
    }
  };

  const addExcludedTiming = (): void => {
    const newTiming = `${currentStartTime} - ${currentEndTime}`;
    setExcludedTimings([...excludedTimings, newTiming]);
  };

  const handleRemoveTiming = (index: number) => {
    setExcludedTimings((prevTimings) => prevTimings.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      alert("Please add at least one option!");
      return;
    }
    onGenerate({ activities: selectedActivities, location, excludeDays, excludedTimings });
  };

  return (
    <div className="bg-header p-6 rounded-lg shadow-lg relative text-white">
      <h2 className="text-2xl font-bold text-orange mb-6 text-center">Input Your Criteria</h2>
      {popupMessage && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md animate-fade-in">
          {popupMessage}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Styled Search Bar */}
        <div className="relative">
          <div className={`flex items-center border-b ${isFocused ? "border-orange" : "border-gray-300"}`}>
            <FaSearch className={`mr-2 ${isFocused ? "text-white" : "text-gray-300"}`} />
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-300 placeholder-gray-300"
              placeholder="Search module..."
            />
          </div>

          {/* Dropdown Menu */}
          {query && (
            <ul className="absolute z-10 bg-mainbg shadow-lg rounded-md mt-1 max-h-40 w-full overflow-auto border border-gray-700">
              {filteredOptions.map((option: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleAddOption(option)}
                  className="px-4 py-2 cursor-pointer text-gray-300 hover:bg-orange hover:text-white transition-all duration-200"
                >
                  {option.moduleCode}: {option.title}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-300">No matches found</li>
              )}
            </ul>
          )}
        </div>

        {/* Rest of the Form */}
        {/* Location Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-orange">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 bg-mainbg text-gray-300 rounded-md border border-gray-600 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange"
            placeholder="e.g., Office, Home"
          />
        </div>

        {/* Excluded Days */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-orange">Excluded Days</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleExcludeDay(day)}
                className={`px-3 py-1 rounded-md ${
                  excludeDays.includes(day)
                    ? "bg-orange text-white"
                    : "bg-mainbg text-gray-300 border border-gray-600"
                } hover:bg-orange hover:text-white transition-all duration-200`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Unfavorable Timings */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-orange">Unfavorable Timings</label>
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="time"
              value={currentStartTime}
              onChange={(e) => setCurrentStartTime(e.target.value)}
              className="bg-mainbg text-gray-300 border border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <span className="text-orange">to</span>
            <input
              type="time"
              value={currentEndTime}
              onChange={(e) => setCurrentEndTime(e.target.value)}
              className="bg-mainbg text-gray-300 border border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <button
              type="button"
              onClick={addExcludedTiming}
              className="bg-orange text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
            >
              Add
            </button>
          </div>
          {excludedTimings.length > 0 && (
            <ul className="mt-4 space-y-2">
              {excludedTimings.map((timing, index) => (
                <li key={index} className="flex justify-between items-center bg-mainbg p-3 rounded-md shadow-md">
                  <span className="text-gray-300">{timing}</span>
                  <button
                    onClick={() => handleRemoveTiming(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-orange text-white py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
          >
            Generate Timetable
          </button>
        </div>

        {/* Display Selected Activities */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-orange mb-4">Selected Modules</h3>
          {selectedActivities.length === 0 ? (
            <p className="text-gray-300 text-center">No modules added yet.</p>
          ) : (
            <ul className="space-y-2">
              {selectedActivities.map((activity, index) => (
                <li
                  key={index}
                  className="bg-mainbg shadow-md rounded-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-bold text-orange">
                      {activity.moduleCode}: {activity.title}
                    </p>
                    <p className="text-sm text-gray-300">
                      Available Days: {activity.availableDays?.join(", ") || "None"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveActivity(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}
