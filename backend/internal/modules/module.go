package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/thejus03/hacknroll/backend/internal/models"
)

func GetAllModules(c *gin.Context) {
	//  only returns the list of modules for searching purposes
	url := "https://api.nusmods.com/v2/2024-2025/moduleList.json"
	resp, err := http.Get(url)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error:", err)
	}

	var data []map[string]any
	json.Unmarshal(body, &data)
	var courseCode []string

	for _, module := range data {
		if code, ok := module["moduleCode"].(string); ok {
			courseCode = append(courseCode, code)
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Error getting module code",
			})
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Success",
		"payload": courseCode,
	})

}

func Submit(c *gin.Context, venueData map[string]any) {
	jsonData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println("error reading json")
		return
	}
	var userInput models.UserInput
	if err := json.Unmarshal(jsonData, &userInput); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}
	var rawDataList []any
	for _, modCode := range userInput.ChosenLessons {
		url := fmt.Sprintf("https://api.nusmods.com/v2/2024-2025/modules/%s.json", strings.ToUpper(modCode))
		fmt.Println("url:", url)
		resp, err := http.Get(url)
		if err != nil {
			fmt.Println("Error:", err)
		}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("something wrong with fetching module info using codes")
		}
		var data map[string]any
		json.Unmarshal(body, &data)
		rawDataList = append(rawDataList, data)
		defer resp.Body.Close()
	}

	freeDays := make(map[string]bool)
	for _, day := range userInput.FreeDays {
		freeDays[day] = true
	}

	// get earliest and latest time
	const timeLayout = "1504"
	earliestTime, err := time.Parse(timeLayout, userInput.EarliestTime)
	semester := userInput.Semester
	if err != nil {
		fmt.Println("Error parsing earliest time:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid earliest time format"})
		return
	}
	latestTime, err := time.Parse(timeLayout, userInput.LatestTime)
	if err != nil {
		fmt.Println("Error parsing latest time:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid latest time format"})
		return
	}

}

func cleanData(rawDataList []any, semester int, venueData map[string][]float64, maxDistance float64) (map[models.Lesson][]models.Slot, []models.Lesson, error) {
	// var filtered []models.LessonSlot
	// filtering
	const timeLayout = "1504"
	var lessonToSlotListMap = make(map[models.Lesson][]models.Slot)
	var lessonList []models.Lesson
	slotCount := 0 // tracking foer performance
	for _, eachModRawData := range rawDataList {
		modDataMap, ok := eachModRawData.(map[string]any)
		if !ok {
			fmt.Println("eachModRawData is not a map[string]any")
			continue
		}
		// semesterData:= semesterData.([]map[string]any)
		semesterData, ok := modDataMap["semesterData"].([]any)
		// semesterData, ok := modDataMap["semesterData"].([]map[string]any) // the actual type
		// fmt.Println(semester, semesterData)
		if !ok {
			return nil, nil, fmt.Errorf("cannot access semesterData")
		}
		var eachModSemData map[string]any
		for _, data := range semesterData {
			assertedData := data.(map[string]any)
			if sem, ok := assertedData["semester"]; ok && int(sem.(float64)) == semester {
				// note down the indices to be removed
				eachModSemData = data.(map[string]any)
				break
			}
		}
		for _, slotInterface := range eachModSemData["timetable"].([]any) {
			slot, ok := slotInterface.(map[string]any)
			if !ok {
				return nil, nil, fmt.Errorf("slot is not a map[string]any")
			}
			lessonType, ok := slot["lessonType"].(string)
			if !ok {
				return nil, nil, fmt.Errorf("lessonType is not a string")
			}
			day, ok := slot["day"].(string) // only one day
			if !ok {
				return nil, nil, fmt.Errorf("day is not a string")
			}
			startTimeStr, ok := slot["startTime"].(string)
			if !ok {
				return nil, nil, fmt.Errorf("startTime is not a string")
			}
			startTime, err := time.Parse(timeLayout, startTimeStr)
			if err != nil {
				return nil, nil, fmt.Errorf("startTime is not in the correct format")
			}
			endTimeStr, ok := slot["endTime"].(string)
			if !ok {
				return nil, nil, fmt.Errorf("endTime is not a string")
			}
			
			endTime, err := time.Parse(timeLayout, endTimeStr)
			if err != nil {
				return nil, nil, err
			}
			classNo, ok := slot["classNo"].(string)
			if !ok {
				return nil, nil, fmt.Errorf("classNo is not a string")
			}
			venue, ok := slot["venue"].(string)
			if !ok {
				return nil, nil, fmt.Errorf("venue is not a string")
			}
			lessonInstance := models.Lesson{ModuleCode: modDataMap["moduleCode"].(string), LessonType: lessonType}
			closeEnough := false
			// Check the JSON for location coordinates
			var locationInstance models.Location
			var slotInstance models.Slot
			for key, locationValue := range venueData {
				// if key == venue {
				if strings.Contains(venue, key) {
					fmt.Println("venue:", venue, "key:", key)
					// validLocation = true
					if !ok {
						return nil, nil, fmt.Errorf("location is not a map[string]any")
					}
					x := locationValue[0]
					y := locationValue[1]
					locationInstance = models.Location{
						Name: key,
						X:    x,
						Y:    y,
					}
					break
				} else {
					locationInstance = models.Location{
						Name: venue,
						X:    0,
						Y:    0,
					}

				}
			}

			
		}
	}