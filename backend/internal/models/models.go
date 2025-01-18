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
