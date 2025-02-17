package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
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
	rawDataList, jsonData, _ := modDataFromList(c, true)
	freeDays := make(map[string]bool)

	var userInput models.UserInput
	if err := json.Unmarshal(jsonData, &userInput); err != nil {
		fmt.Println("Error unmarshalling JSON here:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
	}
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
	makeLink(c, res)

}

func cleanData(rawDataList []any, semester int, venueData map[string][]float64, freeDays map[string]bool) (map[models.Lesson]map[string][]models.Slot, []models.Lesson, error) {
	// filtering
	const timeLayout = "1504"
	var lessonToClassNoToSlotListMap = make(map[models.Lesson]map[string][]models.Slot)
	var lessonList []models.Lesson
	slotCount := 0 // tracking foer performance
	// iterate through each module
	for _, eachModRawData := range rawDataList {
		modDataMap, ok := eachModRawData.(map[string]any)
		if !ok {
			fmt.Println("eachModRawData is not a map[string]any")
			continue
		}
		semesterData, ok := modDataMap["semesterData"].([]any)
		if !ok {
			return nil, nil, fmt.Errorf("cannot access semesterData")
		}

		// get semester data
		var eachModSemData map[string]any
		for _, data := range semesterData {
			assertedData := data.(map[string]any)
			if sem, ok := assertedData["semester"]; ok && int(sem.(float64)) == semester {
				// note down the indices to be removed
				eachModSemData = data.(map[string]any)
				break
			}
		}
		// iterate through each slot for the module
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

			x := venueData[venue][0]
			y := venueData[venue][1]

			locationInstance = models.Location{
				Name: venue,
				X:    x,
				Y:    y,
			}

			avoid := false
			// Check if this slot can be merged
			if SlotList, exists := lessonToClassNoToSlotListMap[lessonInstance]; exists {
				for _, slots := range SlotList {
					for _, slot := range slots {
						if slot.StartTime.Equal(startTime) && slot.EndTime.Equal(endTime) && slot.Day == day {
							slotvenue := extractBuildingName(slot.LocationObject.Name)
							if slotvenue == venue {
								avoid = true
								break
							}
						}
					}
				}
			}

			if avoid {
				continue
			}

			slotCount++ // slot count is lesser  than previous commit
			slotInstance = models.Slot{Day: day, StartTime: startTime, EndTime: endTime, LocationObject: locationInstance, ClassNo: classNo}

			// If class no is the same then we are creating array of slots w same class no
			mapKeyExists := false
			for key, classNoMap := range lessonToClassNoToSlotListMap {
				// if same Lesson Type,
				if key == lessonInstance {
					mapKeyExists = true
					classNoSame := false
					for classNoKey, slotArr := range classNoMap {
						if classNoKey == classNo {
							classNoSame = true
							slotArr = append(slotArr, slotInstance)
						}
						classNoMap[classNoKey] = slotArr
						break
					}
					if !classNoSame {
						classNoMap[classNo] = []models.Slot{slotInstance}
					}
				}
			}
			if !mapKeyExists {
				// initialise the key/value pair
				lessonToClassNoToSlotListMap[lessonInstance] = map[string][]models.Slot{classNo: {slotInstance}}
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
	// fmt.Println("parts:", parts[0])
	return parts[0] // Return the part before '-' or the whole key if '-' is absent
}

func makeLink(c *gin.Context, lessonSlotList [][]models.LessonSlot) {
	modTypeNoMapList := []map[string]map[string]string{}
	for _, eachTimetable := range lessonSlotList {
		modTypeNoMap := make(map[string]map[string]string)
		for _, lessonSlotVar := range eachTimetable {
			// check if they moduleCode exists, if no, make one, else append
			if _, exists := modTypeNoMap[lessonSlotVar.Lesson.ModuleCode]; !exists {
				modTypeNoMap[lessonSlotVar.Lesson.ModuleCode] = map[string]string{}
			}
			var lessonType string
			switch lessonSlotVar.Lesson.LessonType {
			case "Lecture":
				lessonType = "LEC"
			case "Tutorial":
				lessonType = "TUT"
			case "Workshop":
				lessonType = "WS"
			case "Laboratory":
				lessonType = "LAB"
			case "Recitation":
				lessonType = "REC"
			}
			// fmt.Println("lessonType:", lessonType)
			modTypeNoMap[lessonSlotVar.Lesson.ModuleCode][lessonType] = lessonSlotVar.Slot.ClassNo
		}
		modTypeNoMapList = append(modTypeNoMapList, modTypeNoMap)
	}
	fiveLinks := []string{}
	for _, timetable := range modTypeNoMapList {
		url := "https://nusmods.com/timetable/sem-2/share?"
		for modCode, moduleMap := range timetable {
			url += modCode + "="
			for classType, classNo := range moduleMap {
				url += classType + ":" + classNo + ","
				// fmt.Println("classType:", classType, "classNo", classNo)
			}
			// once the module's slots finish
			url += "&"
		}
		fiveLinks = append(fiveLinks, url[:len(url)-2])
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success", "payload": fiveLinks})
	fmt.Println(fiveLinks)
}

func modDataFromList(c *gin.Context, isSubmit bool) ([]any, []byte, int) {
	var rawDataList []any
	var semester int
	jsonData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println("error reading json")
		return nil, nil, 2
	}
	var chosenLessons []string
	if !isSubmit {
		var chosenLessonMap map[string][]string
		if err := json.Unmarshal(jsonData, &chosenLessonMap); err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
			return nil, nil, 2
		}
		chosenLessons = chosenLessonMap["modules"]
		semester, err = strconv.Atoi(chosenLessonMap["semester"][0])
		if err != nil {
			fmt.Println("Error converting semester to int:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid semester format"})
			return nil, nil, 2
		}
		fmt.Println("semester:", semester)
	} else {
		var userInput models.UserInput
		if err := json.Unmarshal(jsonData, &userInput); err != nil {
			fmt.Println("Error unmarshalling JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		}
		chosenLessons = userInput.ChosenLessons
	}
	for _, modCode := range chosenLessons {
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
	return rawDataList, jsonData, semester

}

func CheckFreeDays(c *gin.Context) {

	rawDataList, _, semester := modDataFromList(c, false) //make this global variable
	// go through each slot and make a map
	modToDays := make(map[string]map[string][]string)
	// where the key is the module code and value is all the freeDays
	twoDArray := [][]string{}
	for _, eachModRawData := range rawDataList {
		modDataMap, ok := eachModRawData.(map[string]any)
		if !ok {
			fmt.Println("eachModRawData is not a map[string]any")
			continue
		}
		modCode := modDataMap["moduleCode"]
		modCodeString, ok := modCode.(string)
		if !ok {
			fmt.Println("modCode cannot be a string")
			continue
		}
		// semesterData:= semesterData.([]map[string]any)
		semesterData, ok := modDataMap["semesterData"].([]any)
		// semesterData, ok := modDataMap["semesterData"].([]map[string]any) // the actual type
		// fmt.Println(semester, semesterData)
		if !ok {
			return
		}

		var eachModSemData map[string]any
		for _, data := range semesterData {
			assertedData := data.(map[string]any)
			if sem, ok := assertedData["semester"]; ok && int(sem.(float64)) == semester {
				eachModSemData = data.(map[string]any)
				break
			}
		}
		for _, slotInterface := range eachModSemData["timetable"].([]any) {
			slot, ok := slotInterface.(map[string]any)
			lessonType, ok := slot["lessonType"].(string)
			if !ok {
				return
			}
			// lessonType, ok := slot["lessonType"].(string)
			if !ok {
				return
			}
			dayString, ok := slot["day"].(string) // only one day
			if !ok {
				return
			}
			// ignore adding to the mandatory lesson days if it is a lecture
			if lessonType == "Lecture" {
				continue
			}
			if _, exists := modToDays[modCodeString]; !exists {
				modToDays[modCodeString] = make(map[string][]string)
			} 
			// only add the day if it is not already in the list
			if _, exists := modToDays[modCodeString][lessonType]; !exists {
				modToDays[modCodeString][lessonType] = []string{}
			}
			
			addDay := true
			for _, day := range modToDays[modCodeString][lessonType] {
				if day == dayString {
					addDay = false
					continue
				}
			}
			if addDay {
				modToDays[modCodeString][lessonType] = append(modToDays[modCodeString][lessonType], dayString)
			}
			
		}
		fmt.Println("modToDays:", modToDays)
	}
	for _, rest := range modToDays {
		for _, slotlist := range rest {

			twoDArray = append(twoDArray, slotlist)
		}
		// for all the mods if the days are common
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success", "payload": twoDArray})
	// [[Monday, Tuesday], [Monday, Wednesday], [Thursday]]

}
