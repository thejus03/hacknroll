"use client";
import { useState, useEffect, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

interface TimetableFormProps {
  onGenerate: (data: {
    options: string[];
    semester: number;
    excludeDays: string[];
    excludedTimings: string[];
  }) => void;
}

export default function TimetableForm({ onGenerate }: TimetableFormProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [semester, setSemester] = useState<number | "">("");
  const [excludeDays, setExcludeDays] = useState<string[]>([]);
  const [excludedTimings, setExcludedTimings] = useState<string[]>([]);
  const [popupMessage] = useState<string>("");
  const [currentStartTime, setCurrentStartTime] = useState<string>("07:00");
  const [currentEndTime, setCurrentEndTime] = useState<string>("08:00");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);

  const daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    getOptions();
    console.log(options);
  }, []);

  const getOptions = async (): Promise<void> => {
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
      console.error("Error fetching options", error);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toUpperCase().includes(query.toUpperCase())
  ).slice(0, 5);

  const handleAddOption = (option: string): void => {
    setSelectedOptions([...selectedOptions, option]);
    setQuery(""); // Clear the search query
  };

  const handleRemoveOption = (index: number): void => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
  };

  const toggleExcludeDay = (day: string): void => {
    const newExcludedDays = excludeDays.includes(day)
      ? excludeDays.filter((d) => d !== day)
      : [...excludeDays, day];

    setExcludeDays(newExcludedDays);
  };

  const addExcludedTiming = (): void => {
    const newTiming = `${currentStartTime} - ${currentEndTime}`;
    setExcludedTimings([...excludedTimings, newTiming]);
  };

  const handleRemoveTiming = (index: number): void => {
    setExcludedTimings((prevTimings) =>
      prevTimings.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      alert("Please add at least one option!");
      return;
    }
    onGenerate({ options: selectedOptions, semester: Number(semester), excludeDays, excludedTimings });
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
            Search Option
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
              placeholder="Search option..."
            />
          </div>

          {/* Dropdown Menu */}
          {query && (
            <ul className="absolute z-10 bg-mainbg shadow-lg rounded-md mt-1 max-h-40 w-full overflow-auto border border-gray-700">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleAddOption(option)}
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

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-orange">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-full mt-1 bg-mainbg text-gray-300 rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange appearance-none"
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
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

        {/* Favourable Timings */}
        <div>
          <label className="block text-sm font-medium text-orange">Favourable Timings</label>
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
          className="w-full bg-orange text-white py-2 rounded-md hover:bg-orange-700 transition-all duration-300"
        >
          Generate Timetable
        </button>
      </form>

      {/* Display Selected Options */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-orange mb-4">Selected Options</h3>
        {selectedOptions.length === 0 ? (
          <p className="text-gray-300 text-center">No options added yet.</p>
        ) : (
          <ul className="space-y-2">
            {selectedOptions.map((option, index) => (
              <li
                key={index}
                className="bg-mainbg shadow-md rounded-md p-4 flex justify-between items-center"
              >
                <p className="text-sm font-bold text-orange">{option}</p>
                <button
                  onClick={() => handleRemoveOption(index)}
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
