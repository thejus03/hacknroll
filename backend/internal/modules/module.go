package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

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

}
