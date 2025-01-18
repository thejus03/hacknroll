package graph

import (
	// "fmt"
	"github.com/thejus03/hacknroll/backend/internal/models"
)

type Graph map[models.LessonSlot]map[models.LessonSlot]struct{}

func CreateGraph(lessonSlotList []models.LessonSlot) Graph {
	graph := make(Graph)
	// fmt.Println("lessonSlotList", lessonSlotList)
	// doesnt matter whats the value, its the 2 keys that matter
	for _, lessonSlot := range lessonSlotList {
		for _, otherLessonSlot := range lessonSlotList {
			if lessonSlot.Lesson == otherLessonSlot.Lesson {
				continue
			} else if lessonSlot.Slot.Day != otherLessonSlot.Slot.Day {
				continue
			}

			// Check for overlapping times
			module_i_st := lessonSlot.Slot.StartTime
			module_i_et := lessonSlot.Slot.EndTime
			module_j_st := otherLessonSlot.Slot.StartTime
			module_j_et := otherLessonSlot.Slot.EndTime

			if module_i_st.Before(module_j_et) && module_i_et.After(module_j_st) {
				if _, exists := graph[lessonSlot]; !exists {
					graph[lessonSlot] = make(map[models.LessonSlot]struct{})
				}
				if _, exists := graph[otherLessonSlot]; !exists {
					graph[otherLessonSlot] = make(map[models.LessonSlot]struct{})
				}
				// Add modules[j] as an adjacent module and vice versa since the graph is undirected	
				graph[lessonSlot][otherLessonSlot] = struct{}{}
				graph[otherLessonSlot][lessonSlot] = struct{}{}
				// fmt.Println("Added edge between", lessonSlot, "and", otherLessonSlot)
			}
		}
	}
	return graph
}

func (graph Graph) IsAdjacent(mod models.LessonSlot, set []models.LessonSlot) bool {
	for _, module := range set {
		if _, exists := graph[mod][module]; exists {
			// fmt.Println("Found adjacent module",*mod, "->", module)
			return true
		}
	}
	// fmt.Println("No adjacent module found for", *mod)
	return false
}
