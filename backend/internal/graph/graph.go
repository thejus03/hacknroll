package graph

import (
	// "fmt"
	"github.com/thejus03/hacknroll-25/backend/internal/models"
)

type Graph map[models.LessonSlot]map[models.LessonSlot]struct{}
