export interface Activity {
    activity: string;
    duration: number;
    priority: number;
  }
  
  export interface TimetableFormData {
    activities: Activity[];
    location: string;
    excludeDays: string[];
    excludedTimings: string[];
  }
  