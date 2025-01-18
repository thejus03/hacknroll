"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

// Helper function to check if two time ranges overlap
const timeRangesOverlap = (userRange, activityRange) => {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map((str) => str.padStart(2, "0"));
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const [userStart, userEnd] = userRange.split(" - ").map(parseTime);
  const [activityStart, activityEnd] = activityRange.split(" - ").map(parseTime);

  return userStart < activityEnd && activityStart < userEnd;
};

export default function TimetableForm({ onGenerate }) {
  const [query, setQuery] = useState(""); // For dropdown search bar
  const [selectedActivities, setSelectedActivities] = useState([]); // To store selected activities
  const [location, setLocation] = useState(""); // For location input
  const [excludeDays, setExcludeDays] = useState([]); // For excluded days
  const [excludedTimings, setExcludedTimings] = useState([]); // For excluded timings
  const [popupMessage, setPopupMessage] = useState(""); // For conflict popup messages
  const [currentStartTime, setCurrentStartTime] = useState("07:00");
  const [currentEndTime, setCurrentEndTime] = useState("08:00");
  const [isFocused, setIsFocused] = useState(false);
  const [options, setOptions] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Predefined activity options with available days and timings
  /* const options = [
    { activity: "Morning Yoga", availableDays: ["Monday", "Wednesday", "Friday"], timing: "07:00 - 08:00" },
    { activity: "Study Session", availableDays: ["Tuesday", "Thursday"], timing: "09:00 - 12:00" },
    { activity: "Gym Workout", availableDays: ["Monday", "Tuesday", "Thursday"], timing: "18:00 - 19:00" },
    { activity: "Meeting", availableDays: ["Wednesday"], timing: "10:00 - 11:00" },
    { activity: "Lunch Break", availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], timing: "12:00 - 13:00" },
    { activity: "Meditation", availableDays: ["Saturday", "Sunday"], timing: "08:00 - 08:30" },
    { activity: "Project Work", availableDays: ["Tuesday", "Thursday"], timing: "14:00 - 16:00" },
    { activity: "Dinner with Friends", availableDays: ["Friday", "Saturday"], timing: "19:00 - 21:00" },
  ]; */

  // Puts in all data from getOptions when utilising search bar
  useEffect(() => {
    getOptions()
    console.log(options)
  }, [])

  // Get options
  const getOptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllMods", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json();
      setOptions(data.payload);
    }
    catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  /* Add startsWith for next implement */
  const filteredOptions: string[] = options.filter((option: string) =>
    option.toUpperCase().includes(query.toUpperCase())
  ).slice(0,5);

  const handleAddActivity = (activityObj) => {
    setSelectedActivities([...selectedActivities, activityObj]);
    setQuery(""); // Clear the search query
  };

  const handleRemoveActivity = (index) => {
    setSelectedActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };

  const toggleExcludeDay = (day) => {
    const newExcludedDays = excludeDays.includes(day)
      ? excludeDays.filter((d) => d !== day) // Remove the day if already excluded
      : [...excludeDays, day]; // Add the day to exclude

    const conflicts = selectedActivities.some((activity) =>
      activity.availableDays.every((availableDay) => newExcludedDays.includes(availableDay))
    );

    if (conflicts) {
      const conflictingActivities = selectedActivities.filter((activity) =>
        activity.availableDays.every((availableDay) => newExcludedDays.includes(availableDay))
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

  const addExcludedTiming = () => {
    const newTiming = `${currentStartTime} - ${currentEndTime}`;

    const conflicts = selectedActivities.some((activity) =>
      timeRangesOverlap(newTiming, activity.timing)
    );

    if (conflicts) {
      const conflictingActivities = selectedActivities.filter((activity) =>
        timeRangesOverlap(newTiming, activity.timing)
      );
      setPopupMessage(
        `The timing "${newTiming}" conflicts with: ${conflictingActivities
          .map((a) => a.activity)
          .join(", ")}.`
      );
      setTimeout(() => setPopupMessage(""), 3000); // Remove popup after 3 seconds
    } else {
      setExcludedTimings([...excludedTimings, newTiming]);
    }
  };

  const handleRemoveTiming = (index) => {
    setExcludedTimings((prevTimings) => prevTimings.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedActivities.length === 0) {
      alert("Please add at least one activity!");
      return;
    }
    onGenerate({ activities: selectedActivities, location, excludeDays, excludedTimings });
  };

  const generateJSONFile = async () => {
  const jsonData = {
    selectedActivities: selectedActivities.map((activity) => ({
      activity: activity.activity,
      availableDays: activity.availableDays,
      timing: activity.timing,
    })),
    includedDays: daysOfWeek.filter((day) => !excludeDays.includes(day)),
    unfavourableTimings: excludedTimings,
  };

  try {
    // Send the JSON data to the backend
    const response = await fetch("/your-backend-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      // Handle the response from the backend, if necessary
      console.log("Data successfully submitted");
    } else {
      console.error("Error submitting data");
    }
  } catch (error) {
    console.error("An error occurred while submitting the data:", error);
  }
};

  return (
    <div className="bg-header p-6 rounded-lg shadow-lg relative text-white">
      <h2 className="text-2xl font-bold text-orange mb-6 text-center">
        Input Your Criteria
      </h2>
      {popupMessage && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md animate-fade-in">
          {popupMessage}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Styled Search Bar */}
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search Activity
          </label>
          <div
            className={`flex items-center border-b ${
              isFocused ? "border-orange" : "border-gray-300"
            }`}
          >
            <FaSearch
              className={`mr-2 ${
                isFocused ? "text-white" : "text-gray-300"
              }`}
            />
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-300 placeholder-gray-300"
              placeholder="Search activity..."
            />
          </div>

          {/* Dropdown Menu */}
          {query && (
            <ul className="absolute z-10 bg-mainbg shadow-lg rounded-md mt-1 max-h-40 w-full overflow-auto border border-gray-700">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleAddActivity(option)}
                  className="px-4 py-2 cursor-pointer text-gray-300 hover:bg-orange hover:text-white transition-all duration-200"
                >
                  {option} 
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-300">No matches found</li>
              )}
            </ul>
          )}
        </div>

        {/* Location */}
        <div>
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
        <div>
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
        <div>
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
          {/* Display Excluded Timings */}
          {excludedTimings.length > 0 && (
            <ul className="mt-4 space-y-2">
              {excludedTimings.map((timing, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-mainbg p-3 rounded-md shadow-md"
                >
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
        <button
          type="submit"
          /* This needs to be implemented with backend*/
          /* onClick={generateJSONFile} */
          className="w-full bg-orange text-white py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
        >
          Generate Timetable
        </button>
      </form>

      {/* Display Selected Activities */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-orange mb-4">Selected Activities</h3>
        {selectedActivities.length === 0 ? (
          <p className="text-gray-300 text-center">No activities added yet.</p>
        ) : (
          <ul className="space-y-2">
            {selectedActivities.map((activity, index) => (
              <li
                key={index}
                className="bg-mainbg shadow-md rounded-md p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-bold text-orange">{activity.activity}</p>
                  <p className="text-sm text-gray-300">
                    Available Days: {activity.availableDays.join(", ")}
                  </p>
                  <p className="text-sm text-gray-300">Timing: {activity.timing}</p>
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
    </div>
  );
}
