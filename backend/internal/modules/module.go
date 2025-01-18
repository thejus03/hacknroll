package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
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
