package models

type UserInput struct {
	ChosenLessons []string `json:"mods"`
	FreeDays      []string `json:"freeDays"`
	EarliestTime  string   `json:"earliestTime"`
	LatestTime    string   `json:"latestTime"`
	Semester      int      `json:"semester"`
}
