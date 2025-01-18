package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/thejus03/hacknroll/backend/internal/modules"
)

type Room struct {
	Floor    int                `json:"floor"`
	Location map[string]float64 `json:"location"`
}

//go:embed venuesMerged.json
var venuesJson []byte

func main() {
	host := "localhost"
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{fmt.Sprintf("http://%s:3000", host)},       // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                // Allow cookies if needed
	}))
	/// Get all coursecodes
	r.GET("/getAllMods", func(c *gin.Context) { modules.GetAllModules(c) })
	venueData := make(map[string][]float64)

	r.POST("/checkFreeDays", func(c *gin.Context) {
		// semester := 2
		modules.CheckFreeDays(c)
	})

	/// Post course data and free days
	r.POST("/getSlots", func(c *gin.Context) {

		json.Unmarshal(venuesJson, &venueData)
		modules.Submit(c, venueData)
	})

	/// Run the server on port 8080
	r.Run(":8080")
}

// func mergeLocation() map[string][2]float64 {
func mergeLocation() {
	venueData := make(map[string]Room)
	json.Unmarshal(venuesJson, &venueData)

	groups := make(map[string][]Room)
	for key, room := range venueData {
		building := extractBuildingName(key) // group according to first 4 characters of location
		groups[building] = append(groups[building], room)
	}
	centers := make(map[string][2]float64)
	for building, rooms := range groups {
		var totalX, totalY float64
		for _, room := range rooms {
			totalX += room.Location["x"]
			totalY += room.Location["y"]
		}
		count := float64(len(rooms))
		centers[building] = [2]float64{totalX / count, totalY / count}
	}
	// return centers
	// Write results to JSON file
	outputFile := "venuesMerged.json"
	if err := writeToJSONFile(outputFile, centers); err != nil {
		fmt.Printf("Error writing to file: %v\n", err)
	} else {
		fmt.Printf("Results written to %s\n", outputFile)
	}
}

func extractBuildingName(key string) string {
	parts := strings.SplitN(key, "-", 2)
	return parts[0] // Return the part before '-' or the whole key if '-' is absent
}

func writeToJSONFile(filename string, data any) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}

	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	_, err = file.Write(jsonData)
	defer file.Close()
	return err
}
