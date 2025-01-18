package models

import "time"

type UserInput struct {
	ChosenLessons []string `json:"mods"`
	FreeDays      []string `json:"freeDays"`
	EarliestTime  string   `json:"earliestTime"`
	LatestTime    string   `json:"latestTime"`
	Semester      int      `json:"semester"`
}
type Lesson struct {
	ModuleCode string `json:"moduleCode"`
	LessonType string `json:"lessonType"` // "lec", "tut", "rec"
}

type Slot struct {
	Day            string    `json:"day"` // "mon", "tue", "wed", "thu", "fri"
	StartTime      time.Time `json:"startTime"`
	EndTime        time.Time `json:"endTime"`
	LocationObject Location  `json:"location"`
	ClassNo        string    `json:"classNo"`
}

func (s1 Slot) IsEqual(s2 Slot) bool {
	if s1.Day != s2.Day {
		return false
	}
	if s1.StartTime != s2.StartTime {
		return false
	}
	if s1.EndTime != s2.EndTime {
		return false
	}
	if s1.LocationObject.X != s2.LocationObject.X && s1.LocationObject.Y != s2.LocationObject.Y {
		return false
	}
	return true
}
