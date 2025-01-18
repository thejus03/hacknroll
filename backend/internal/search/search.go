package search

import (
	"fmt"
	"github.com/thejus03/hacknroll/backend/internal/models"
	"sort"
	"time"
)

type Tuple struct {
	score     float32
	timetable []models.LessonSlot
}

type TupleHeap []Tuple

func (t *TupleHeap) Len() int      { return len(*t) }
func (t *TupleHeap) Swap(i, j int) { (*t)[i], (*t)[j] = (*t)[j], (*t)[i] }

// The ordering function
func (t *TupleHeap) Less(i, j int) bool { return (*t)[i].score < (*t)[j].score }
func (t *TupleHeap) Push(x interface{}) { *t = append(*t, x.(Tuple)) }

// The pop function pops last element as container/heap swaps the smallest element to last element before calling Pop
func (t *TupleHeap) Pop() interface{} {
	old := *t
	n := len(old)
	x := old[n-1]
	*t = old[0 : n-1]
	return x
}

func PossibleTimetables(lessons []models.Lessons, lessonToSlots map[models.Lesson][]models.Slot, cutoff_timings map[string]time.Time, freeDays map[string]bool, graph graph.Graph) {

	// Sort the lessons in ascending order of number of slots
	sort.Slice(lessons, func(i, j int) bool {
		return len(lessonToSlots[lessons[i]]) < len(lessonToSlots[lessons[j]])
	})
	fmt.Println("Lessons:", lessons)

	var timetables [][]models.LessonSlot

	// Call Backtracking function to find all possilbe timetables



}
