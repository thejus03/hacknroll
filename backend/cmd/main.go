package main

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/thejus03/hacknroll/backend/modules"
)

//go:embed venues.json
var venuesJson []byte
func main() {
	
	r := gin.Default()
	
	/// Get all coursecodes
	r.GET("/getAllMods", func(c *gin.Context) { modules.GetAllModules(c)})
	venueData := make(map[string][]float64)

	/// Post course data and free days
	r.POST("/getFreeSlots", func (c *gin.Context) {
		json.Unmarshal(venuesJson, &venueData)
		modules.Submit(c, venueData)
	})

	/// Run the server on port 8080
	r.Run(":8080")
}

