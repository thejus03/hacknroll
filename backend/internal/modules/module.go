package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/thejus03/hacknroll/backend/internal/graph"
	"github.com/thejus03/hacknroll/backend/internal/models"
	"github.com/thejus03/hacknroll/backend/internal/search"
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

func Submit(c *gin.Context, venueData map[string][]float64) {
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
	cutoff_timings := map[string]time.Time{"earliest": earliestTime, "latest": latestTime}
	lessonToClassNoToSlotListMap, lessons, err := cleanData(rawDataList, semester, venueData, freeDays)
	if err != nil {
		fmt.Println("Error cleaning data:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error cleaning data"})
		return
	}
	// use cleaned data to make a list to make a graph
	var lessonSlotList []models.LessonSlot
	for lesson, classNoMap := range lessonToClassNoToSlotListMap {
		for _, slotList := range classNoMap {
			for _, slot := range slotList {
				lessonSlotList = append(lessonSlotList, models.LessonSlot{Lesson: lesson, Slot: slot})
			}
		}
	}
	// fmt.Println("map:", lessonToClassNoToSlotListMap)
	graph := graph.CreateGraph(lessonSlotList)
	var res [][]models.LessonSlot = search.PossibleTimetables(lessons, lessonToClassNoToSlotListMap, cutoff_timings, freeDays, graph)
	// make the link
	makeLink(res)
	c.JSON(http.StatusOK, gin.H{"message": "Success", "payload": res})

}

func cleanData(rawDataList []any, semester int, venueData map[string][]float64, freeDays map[string]bool) (map[models.Lesson]map[string][]models.Slot, []models.Lesson, error) {
	// var filtered []models.LessonSlot
	// filtering
	const timeLayout = "1504"
	var lessonToClassNoToSlotListMap = make(map[models.Lesson]map[string][]models.Slot)
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
			if _, exists := freeDays[day]; exists {
				if lessonType != "Lecture" {
					continue
				}
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
			venue = extractBuildingName(venue)
			lessonInstance := models.Lesson{ModuleCode: modDataMap["moduleCode"].(string), LessonType: lessonType}
			// Check the JSON for location coordinates
			var locationInstance models.Location
			var slotInstance models.Slot
			noMatch := true
			//venueData is from json
			for key, locationValue := range venueData {
				if key == venue {
					noMatch = false
					// fmt.Println("venue:", venue, "key:", key)
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

				}
			}
			if noMatch {
				fmt.Println("no match found for venue:", venue)
				locationInstance = models.Location{
					Name: venue,
					X:    0,
					Y:    0,
				}
			}

			if len(locationInstance.Name) == 0 {
				fmt.Println(lessonInstance.ModuleCode, " has no location:")
				continue
			}
			slotCount++ // slot count is lesser  than previous commit
			slotInstance = models.Slot{Day: day, StartTime: startTime, EndTime: endTime, LocationObject: locationInstance, ClassNo: classNo}

			mapKeyExists := false
			for key, classNoMap := range lessonToClassNoToSlotListMap {
				// if same Lesson Type,
				if key == lessonInstance {
					mapKeyExists = true
					// check if the day, time and same x,y coordinate are the same, if so , dont add
					// append to the list
					// check if the class number is the same
					classNoSame := false
					for classNoKey, slotArr := range classNoMap {
						if classNoKey == classNo {
							classNoSame = true
							slotArr = append(slotArr, slotInstance)
						}
					}
					if !classNoSame {
						classNoMap[classNo] = []models.Slot{slotInstance}
					}
				}
			}
			if !mapKeyExists {
				// initialise the key/value pair
				lessonToClassNoToSlotListMap[lessonInstance] = map[string][]models.Slot{classNo: []models.Slot{slotInstance}}
				lessonList = append(lessonList, lessonInstance)
			}
		}

	}
	var counter uint64 = 1
	for _, classNoMap := range lessonToClassNoToSlotListMap {
		counter *= uint64(len(classNoMap))
	}
	fmt.Println("multiplied slots:", counter)
	return lessonToClassNoToSlotListMap, lessonList, nil

}

func extractBuildingName(key string) string {
	parts := strings.SplitN(key, "-", 2)
	return parts[0] // Return the part before '-' or the whole key if '-' is absent
}

func makeLink(lessonSlotList [][]models.LessonSlot) {
	modTypeNoMapList := []map[string]map[string]string{}
	for _, eachTimetable := range lessonSlotList {
		modTypeNoMap := make(map[string]map[string]string)
		for _, lessonSlotVar := range eachTimetable {
			// check if they moduleCode exists, if no, make one, else append
			if _, exists := modTypeNoMap[lessonSlotVar.Lesson.ModuleCode]; !exists {
				modTypeNoMap[lessonSlotVar.Lesson.ModuleCode] = map[string]string{}
			}
			var lessonType string
			switch lessonType {
			case "Lecture":
				lessonType = "LEC"
			case "Tutorial":
				lessonType = "TUT"
			case "Workshop":
				lessonType = "WS"
			case "Laboratory":
				lessonType = "LAB"
			case "Recital":
				lessonType = "REC"
			}
			modTypeNoMap[lessonSlotVar.Lesson.ModuleCode][lessonType] = lessonSlotVar.Slot.ClassNo
		}
		modTypeNoMapList = append(modTypeNoMapList, modTypeNoMap)
	}
	fiveLinks := []string{}
	for _, timetable := range modTypeNoMapList {
		url := "https://nusmods.com/timetable/sem-2/share?"
		for modCode, moduleMap := range timetable {
			url += modCode + "="
			for classType
		}
	}

	fmt.Println(modTypeNoMapList)
}
