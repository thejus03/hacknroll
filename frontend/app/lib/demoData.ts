export const demoData = {
    timetables: [
      {
        id: 1,
        name: "Scenario:",
        conditions: "2 Free Days: Wednesday, Friday",
        lessons: [
          {
            moduleCode: "MA1522",
            lessonType: "Lecture",
            day: "Monday",
            startTime: "0900",
            endTime: "1100",
            venue: "E-Hybrid_C",
            color: "bg-pastel_orange", // Contrasting color
          },
          {
            moduleCode: "CS2030S",
            lessonType: "Lecture",
            day: "Monday",
            startTime: "1200",
            endTime: "1400",
            venue: "E-Learning",
            color: "bg-pastel_blue", // Contrasting color
          },
          {
            moduleCode: "CS2040S",
            lessonType: "Lecture",
            day: "Monday",
            startTime: "1400",
            endTime: "1600",
            venue: "UT-AUD1",
            color: "bg-pastel_yellow", // Contrasting color
          },
          {
            moduleCode: "HSI1000",
            lessonType: "Workshop",
            day: "Tuesday",
            startTime: "0900",
            endTime: "1100",
            venue: "S12-0402",
            color: "bg-pastel_green", // Contrasting color
          },
          {
            moduleCode: "GEA1000",
            lessonType: "Tutorial",
            day: "Tuesday",
            startTime: "1100",
            endTime: "1300",
            venue: "BIZ2-0114",
            color: "bg-pastel_teal", // Contrasting color
          },
          {
            moduleCode: "IS1128",
            lessonType: "Lecture",
            day: "Thursday",
            startTime: "0900",
            endTime: "1130",
            venue: "LT9",
            color: "bg-pastel_purple", // Contrasting color
          },
          {
            moduleCode: "CS2030S",
            lessonType: "Lab",
            day: "Thursday",
            startTime: "1000",
            endTime: "1200",
            venue: "COM1-B111",
            color: "bg-pastel_red", // Contrasting color
          },
          {
            moduleCode: "CS2040s",
            lessonType: "Recitation",
            day: "Thursday",
            startTime: "1300",
            endTime: "1530",
            venue: "COM4SR32",
            color: "bg-pastel_cyan", // Contrasting color
          },
        ],
        exams: [
          {
            moduleCode: "MA1522",
            moduleName: "Linear Algebra for Computing",
            examDate: "26-Apr-2025 9:00 AM",
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_orange", // Contrasting color
          },
          {
            moduleCode: "CS2040S",
            moduleName: "Data Structures and Algorithms",
            examDate: "26-Apr-2025 2:00 PM",
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_blue", // Contrasting color
          },
          {
            moduleCode: "GEA1000",
            moduleName: "Quantitative Reasoning with Data",
            examDate: "28-Apr-2025 1:00 PM",
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_teal", // Contrasting color
          },
          {
            moduleCode: "HSI1000",
            moduleName: "How Science Works, Why Science Works",
            examDate: "29-Apr-2025 1:00 PM",
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_green", // Contrasting color
          },
          {
            moduleCode: "CS2030S",
            moduleName: "Programming Methodology II",
            examDate: "30-Apr-2025 1:00 PM",
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_red", // Contrasting color
          },
        ],
      },

      {
        id: 2,
        name: "Scenario:",
        conditions: "Lunch At 12, No lessons before 10AM",
        lessons: [
          {
            moduleCode: "MA1511",
            moduleName: "Mathematics I",
            lessonType: "Lecture",
            day: "Monday",
            startTime: "1400", // 3:00 PM
            endTime: "1600",   // 4:00 PM
            venue: "LT20",
            color: "bg-pastel_red",
          },
          {
            moduleCode: "CS2106",
            moduleName: "Introduction to Operating Systems",
            lessonType: "Tutorial",
            day: "Tuesday",
            startTime: "1000", // 5:00 PM
            endTime: "1200",   // 6:30 PM
            venue: "COM1-B104",
            color: "bg-pastel_blue",
          },
          {
            moduleCode: "GEA1000",
            moduleName: "Quantitative Reasoning with Data",
            lessonType: "Seminar",
            day: "Wednesday",
            startTime: "1000", // 4:00 PM
            endTime: "1230",   // 5:30 PM
            venue: "BIZ1-0502",
            color: "bg-pastel_green",
          },
          {
            moduleCode: "CS2040S",
            moduleName: "Data Structures and Algorithms",
            lessonType: "Lab",
            day: "Thursday",
            startTime: "1300", // 3:00 PM
            endTime: "1500",   // 5:00 PM
            venue: "COM3-0102",
            color: "bg-pastel_cyan",
          },
          {
            moduleCode: "IS1108",
            moduleName: "Introduction to Information Systems",
            lessonType: "Recitation",
            day: "Friday",
            startTime: "1230", // 6:00 PM
            endTime: "1030",   // 7:30 PM
            venue: "LT18",
            color: "bg-pastel_purple",
          },
          {
            moduleCode: "MA1511",
            moduleName: "Mathematics I",
            lessonType: "Tutorial",
            day: "Monday",
            startTime: "1300", // 4:00 PM
            endTime: "1500",   // 5:00 PM
            venue: "LT22",
            color: "bg-pastel_orange",
          },
          {
            moduleCode: "CS2106",
            moduleName: "Introduction to Operating Systems",
            lessonType: "Lecture",
            day: "Tuesday",
            startTime: "1100", // 6:30 PM
            endTime: "0900",   // 8:00 PM
            venue: "COM1-B204",
            color: "bg-pastel_blue",
          },
          {
            moduleCode: "CS2040S",
            moduleName: "Data Structures and Algorithms",
            lessonType: "Recitation",
            day: "Thursday",
            startTime: "1100", // 5:00 PM
            endTime: "1300",   // 6:00 PM
            venue: "COM3-0203",
            color: "bg-pastel_cyan",
          },
          {
            moduleCode: "GEA1000",
            moduleName: "Quantitative Reasoning with Data",
            lessonType: "Tutorial",
            day: "Wednesday",
            startTime: "1300", // 5:30 PM
            endTime: "1600",   // 7:00 PM
            venue: "BIZ2-0303",
            color: "bg-pastel_green",
          },
        ],
        exams: [
          {
            moduleCode: "MA1511",
            moduleName: "Mathematics I",
            examDate: "27-Apr-2025 1:00 PM", // 3 PM on April 27
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_red",
          },
          {
            moduleCode: "CS2106",
            moduleName: "Introduction to Operating Systems",
            examDate: "28-Apr-2025 12:00 PM", // 5 PM on April 28
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_blue",
          },
          {
            moduleCode: "GEA1000",
            moduleName: "Quantitative Reasoning with Data",
            examDate: "29-Apr-2025 11:00 AM", // 4 PM on April 29
            duration: "1 hr 45 mins",
            units: 4,
            color: "bg-pastel_green",
          },
          {
            moduleCode: "CS2040S",
            moduleName: "Data Structures and Algorithms",
            examDate: "30-Apr-2025 3:00 PM", // 3 PM on April 30
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_cyan",
          },
          {
            moduleCode: "IS1108",
            moduleName: "Introduction to Information Systems",
            examDate: "01-May-2025 9:00 PM", // 6 PM on May 1
            duration: "2 hrs",
            units: 4,
            color: "bg-pastel_purple",
          },
        ],
      },
    ],
  };
  