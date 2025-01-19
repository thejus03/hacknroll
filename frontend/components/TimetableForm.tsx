"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import TimetableDisplay from "./TimetableDisplay";

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

export default function TimetableForm({ onGenerate }: TimetableFormProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [semester, setSemester] = useState<number>(1);
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
  }, [fetchOptions]);

  // Submit form data
  const submitSelectedOptions = useEffect(() => {
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
  }, [selectedOptions]);

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
    const [timetables, setTimetables] = useState([])

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

}
