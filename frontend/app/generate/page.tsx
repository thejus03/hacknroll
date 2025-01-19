"use client";
import TimetableForm from "../../components/TimetableForm";
import TimetableDisplay from "../../components/TimetableDisplay";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

interface Timetable {
  rank: number;
  activities: string[];
  location: string;
  freeDays: string[];
}

interface GenerateTimetablesProps {
  mods: string[];
  semester: number;
  freeDays: string[];
  // favourableTimings: string;
}
interface TimetableFormProps {
  onGenerate: (data: {
    mods: string[];
    semester: number;
    freeDays: string[];
    currentStartTime: string;
    currentEndTime: string;
  }) => void;
}

// Define the structure of the response
interface ApiResponse {
  message: string;
  payload: string[][]; // Adjust the inner array type if needed
}
const TimetablePage = () => {
   const [query, setQuery] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [semester, setSemester] = useState<number>(2);
    const [freeDays, setFreeDays] = useState<string[]>([]);
    const [currentStartTime, setCurrentStartTime] = useState<string>("0700");
    const [currentEndTime, setCurrentEndTime] = useState<string>("0800");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [mods, setMods] = useState<string[]>([]);
    const [mandatoryDays, setMandatoryDays] = useState<string[][]>([]);
  
    const daysOfWeek: string[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];
  
    // Dropdown options
    const fetchOptions = useCallback(async () => {
      try {
        const response = await fetch("http://localhost:8080/getAllMods", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMods(data.payload);
        } else {
          console.error("Failed to fetch options. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }, []);
  
    useEffect(() => {
      fetchOptions();
      checkFreeDays();
      console.log(selectedOptions, semester);
    }, [selectedOptions, semester]);
  
    // Submit form data
    const checkFreeDays = () => {
      const submitOptions = async () => {
        try {
          const response = await fetch("http://localhost:8080/checkFreeDays", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ modules: selectedOptions, semester: ["" + semester] }),
          });
    
          if (!response.ok) {
            console.error("Failed to submit options. Status:", response.status);
            return;
          }
    
          const data: ApiResponse = await response.json();
  
        // Extract payload
        const { payload } = data;
        setMandatoryDays(payload);
        console.log("Payload:", payload);
      } catch (error) {
        console.error("Error submitting options:", error);
      }
      };
    
      if (selectedOptions.length > 0) {
        submitOptions();
      }
    };
  
    // useEffect(() => {
    //   if (selectedOptions.length > 0) {
    //     submitSelectedOptions();
    //     console.log("Checker", selectedOptions);
    //   }
    // }, [selectedOptions]);
  
    const handleAddOption = useCallback((mod: string): void => {
      setSelectedOptions((prevOptions) => {
        const updatedOptions = [...prevOptions, mod];
        return updatedOptions;
      });
      setQuery("");
  
    }, []);
  
    const handleRemoveOption = useCallback((mod: string): void => {
      setSelectedOptions((prevOptions) => {
        return prevOptions.filter((modSelected, _) => modSelected !== mod);
      });
    }, []);
  
    const toggleFreeDay = (day: string): void => {
      console.log("Toggling free day:", day);
    
      // Create a copy of freeDays including the new day
      const updatedFreeDays = freeDays.includes(day)
        ? freeDays.filter((d) => d !== day) // Remove the day if it's already selected
        : [...freeDays, day]; // Add the day if it's not already selected
    
      // Check for conflicts with mandatoryDays
      for (const subArray of mandatoryDays) {
        if (subArray.every((mandatoryDay) => updatedFreeDays.includes(mandatoryDay))) {
          alert(`You cannot make ${day} free due to mandatory schedule constraints.`);
          console.log(`Conflict detected: Cannot make ${day} free.`);
          return; // Exit the function without updating freeDays
        }
      }
    
      // Update freeDays if there's no conflict
      setFreeDays(updatedFreeDays);
      console.log("Updated freeDays:", updatedFreeDays);
    };
    
  
    const validateTimings = (): boolean => {
      return currentStartTime < currentEndTime;
    };
  
    // const [timetables, setTimetables] = useState([])
    const handleSubmit = async (e: FormEvent): Promise<void> => {
      e.preventDefault();
  
      if (selectedOptions.length === 0) {
        alert("Please add at least one option!");
        return;
      }
  
      if (!validateTimings()) {
        alert("Start time must be earlier than end time.");
        return;
      }
  
      const [earliesthour, earliestminute] = currentStartTime.split(':').map((time) => time.padStart(2, '0'));
      const earliestTime = earliesthour + earliestminute;
  
      const [latesthour, latestminute] = currentEndTime.split(':').map((time) => time.padStart(2, '0'));
      const latestTime = latesthour + latestminute;
  
      const requestData = {
        mods: selectedOptions,
        freeDays: freeDays,
        semester: semester,
        earliestTime,
        latestTime,
      };
  
  
      try {
        const response = await fetch("http://localhost:8080/getSlots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          const errorMessage = `Failed to submit options. Status: ${response.status}`;
          console.error(errorMessage);
          alert(errorMessage);
          return;
        }
        let data = await response.json();
        console.log("Payload:", data.payload);
        setTimetables(data.payload)
  
  
        alert("Timetable generated successfully!");
      } catch (error) {
        console.error("TimetableDisplay error:", error);
        alert("Failed to generate timetable due to a timetable display error.");
      }
    };
  
    const filteredOptions = mods
      .filter((mod) => mod.toUpperCase().includes(query.toUpperCase()))
      .slice(0, 5);
  const [timetables, setTimetables] = useState<string[]>([]);

  const generateTimetables = ({ mods, semester, freeDays }: GenerateTimetablesProps): void => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const availableDays = daysOfWeek.filter(day => !freeDays.includes(day));

    // // Create Timetable objects
    // const mockTimetables = mods.map((option, index) => ({
    //   rank: index + 1,
    //   activities: [option],
    //   location: "NUS",
    //   freeDays: availableDays,
    //   // favourableTimings: favourableTimings,
    // }));
    // setTimetables(mockTimetables);
  };

  return (
    <div className="min-h-screen bg-mainbg text-white">
      <div className="flex flex-row gap-4 px-6 py-10">
        <div className="w-1/3">
        <div className="bg-header p-6 rounded-lg shadow-lg relative text-white">
      <h2 className="text-2xl font-bold text-orange mb-6 text-center">
        Input Your Criteria
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          {query && (
            <ul className="absolute z-10 bg-mainbg shadow-lg rounded-md mt-1 max-h-40 w-full overflow-auto border border-gray-700">
              {filteredOptions.map((mod, index) => (
                <li
                  key={index}
                  onClick={() => handleAddOption(mod)}
                  className="px-4 py-2 cursor-pointer text-gray-300 hover:bg-orange hover:text-white transition-all duration-200"
                >
                  {mod}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-300">No matches found</li>
              )}
            </ul>
          )}
        </div>
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
        <div>
          <label className="block text-sm font-medium text-orange">Choose days to be free</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleFreeDay(day)}
                className={`px-3 py-1 rounded-md ${
                  freeDays.includes(day)
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
          </div>
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
            {selectedOptions.map((mod, index) => (
              <li
                key={index}
                className="bg-mainbg shadow-md rounded-md p-4 flex justify-between items-center"
              >
                <p className="text-sm font-bold text-orange">{mod}</p>
                <button
                  onClick={() => handleRemoveOption(mod)}
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
        </div>
        <div className="w-2/3">
          <TimetableDisplay linkArrayPool={timetables} />
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
