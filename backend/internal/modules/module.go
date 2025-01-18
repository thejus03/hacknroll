package modules

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllModules(c *gin.Context) {
	url := "https://api.nusmods.com/v2/2024-2025/moduleList.json"
	resp, err := http.Get(url)
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error:", err)
	}

	var data []map[string]any
	json.Unmarshal(body, &data)

}
