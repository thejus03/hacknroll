package search

import (
	"container/heap"
	"fmt"
	"runtime"
	"sort"
	"sync"
	"time"

	"github.com/thejus03/hacknroll/backend/internal/graph"
	"github.com/thejus03/hacknroll/backend/internal/models"
	"github.com/umahmood/haversine"
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

func Backtrack(idx int, lessons []models.Lesson, lessonToSlots map[models.Lesson]map[string][]models.Slot, chosen_lessonslots []models.LessonSlot, timetables *[][]models.LessonSlot, graph graph.Graph, freeDays map[string]bool) {
	// Keep track of which lesson we are at. Then for loop to check if not adjacent then add and recursively track until you reach the end of lesson
	if idx == len(lessons) {
		*timetables = append(*timetables, chosen_lessonslots)
		return
	}

	lesson := lessons[idx]
	for _, class := range lessonToSlots[lesson] {
		possible := true
		for _, slot := range class {
			lessonslot := models.LessonSlot{Lesson: lesson, Slot: slot}
			if graph.IsAdjacent(lessonslot, chosen_lessonslots) {
				possible = false
				break
			}
		}
		if possible {
			for _, slot := range class {
				lessonslot := models.LessonSlot{Lesson: lesson, Slot: slot}
				chosen_lessonslots = append(chosen_lessonslots, lessonslot)
			}
			Backtrack(idx+1, lessons, lessonToSlots, chosen_lessonslots, timetables, graph, freeDays)
			chosen_lessonslots = chosen_lessonslots[:len(chosen_lessonslots)-len(class)]
		}
	}
}

func PossibleTimetables(lessons []models.Lesson, lessonToSlots map[models.Lesson]map[string][]models.Slot, cutoff_timings map[string]time.Time, freeDays map[string]bool, graph graph.Graph) [][]models.LessonSlot {

	// Sort the lessons in ascending order of number of slots
	sort.Slice(lessons, func(i, j int) bool {
		return len(lessonToSlots[lessons[i]]) < len(lessonToSlots[lessons[j]])
	})
	fmt.Println("Lessons:", lessons)

	var timetables [][]models.LessonSlot
	var topTimetables TupleHeap
	heap.Init(&topTimetables)

	// Call Backtracking function to find all possilbe timetables
	Backtrack(0, lessons, lessonToSlots, []models.LessonSlot{}, &timetables, graph, freeDays)

	// Get the number of workers to use
	numWorkers := runtime.NumCPU()
	// Create channels for communication
	workChan := make(chan []models.LessonSlot, 10_000)
	// Create a channel to send timetable results
	resultsChan := make(chan Tuple, 10_000)

	// Start the scoring
	var wg sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for tt := range workChan {
				sorted_timetable := SortByDays(tt)
				score := ScoreTimetable(sorted_timetable, cutoff_timings, freeDays)
				resultsChan <- Tuple{score, tt}
			}
			// Send results to
		}()
	}

	go func() {
		for _, timetable := range timetables {
			workChan <- timetable
		}
		close(workChan) // all jobs submitted
	}()

	go func() {
		wg.Wait()
		close(resultsChan)
	}()

	for result := range resultsChan {
		if topTimetables.Len() < 5 {
			heap.Push(&topTimetables, result)
		} else if result.score > topTimetables[0].score {
			heap.Pop(&topTimetables)
			heap.Push(&topTimetables, result)
		}
	}

	// Get the top 5 timetables
	res := make([][]models.LessonSlot, 0, topTimetables.Len())
	for topTimetables.Len() > 0 {
		var ScoreTimetable Tuple = heap.Pop(&topTimetables).(Tuple)
		res = append(res, ScoreTimetable.timetable)
		fmt.Println("Score", ScoreTimetable.score)
	}

	return res

}

func SortByDays(timetable []models.LessonSlot) map[string][]models.LessonSlot {
	/*
		Sorts the timetable by days and timings
	*/

	var sorted_timetable = make(map[string][]models.LessonSlot)

	for _, lessonslot := range timetable {
		var day = lessonslot.Slot.Day
		if _, exists := sorted_timetable[day]; !exists {
			sorted_timetable[day] = []models.LessonSlot{}
		}
		sorted_timetable[day] = append(sorted_timetable[day], lessonslot)
	}

	// Sort the lessons by start time
	for _, lessonforday := range sorted_timetable {
		sort.Slice(lessonforday, func(i int, j int) bool { return lessonforday[i].Slot.StartTime.Before(lessonforday[j].Slot.StartTime) })
	}

	return sorted_timetable
}

func ScoreTimetable(timetable map[string][]models.LessonSlot, cutoff_timings map[string]time.Time, freeDays map[string]bool) float32 {
	/*
		A versatile scoring system that scores timetable based on several factors:
			1. Location of lessons to minimse travelling between lessons
			2. Avoid big gaps between lessons (>= 1 hours)
			3. Avoid lessons during lunch time (12pm - 2pm)
			4. Avoid lessons on the days users choose to have free (allow lectures since attendance is not compulsory)
			5. Avoid lessons at unfavourable timings chosen by the user (eg, early morning or late night)


	*/

	var score float32 = 0
	layout := "1504"
	eightAM, err := time.Parse(layout, "0800")
	if err != nil {
		fmt.Println("Error converting time")
		return -1
	}
	noon, err := time.Parse(layout, "1200")
	if err != nil {
		fmt.Println("Error converting time")
		return -1
	}
	onePM, err := time.Parse(layout, "1300")
	if err != nil {
		fmt.Println("Error converting time")
		return -1
	}
	twoPM, err := time.Parse(layout, "1400")
	if err != nil {
		fmt.Println("Error converting time")
		return -1
	}
	// only five days so not too bad in efficiency
	for _, timings := range timetable {

		prev_end_time := eightAM
		var prev_location models.Location
		had_lunch := false

		for _, lessonslot := range timings {
			// var location string = lessonslot.Slot.Location
			start_time := lessonslot.Slot.StartTime

			// Award for lectures on free days
			end_time := lessonslot.Slot.EndTime

			// Score based on location
			if prev_location.Name != "" {
				if lessonslot.Slot.LocationObject.X != 0 || lessonslot.Slot.LocationObject.Y != 0 {
					prev := haversine.Coord{Lat: prev_location.Y, Lon: prev_location.X}
					curr := haversine.Coord{Lat: lessonslot.Slot.LocationObject.Y, Lon: lessonslot.Slot.LocationObject.X}
					_, km := haversine.Distance(prev, curr)

					// Penalise based locations between lessons
					maxWalkDistance := 0.250
					score += float32(-(10.0/maxWalkDistance)*km + 10.0)
				}
			}

			// Penalise based on cutoff timings
			if start_time.Before(cutoff_timings["earliest"]) || end_time.After(cutoff_timings["latest"]) {
				score -= 25
			} else {
				// award points for being within the cutoff timings
				score += 50
			}

			// Score based on if had lunch // Notice the weird if-else because we want to penalise only if its not lunch time
			if !had_lunch {
				if (BeforeOrEqual(prev_end_time, noon) && AfterOrEqual(start_time, onePM)) || (BeforeOrEqual(prev_end_time, onePM) && AfterOrEqual(start_time, twoPM)) {
					had_lunch = true
				} else {
					PenaliseBigGaps(&score, &start_time, &prev_end_time)
				}
			} else {
				PenaliseBigGaps(&score, &start_time, &prev_end_time)
			}

			prev_end_time = end_time
			prev_location = lessonslot.Slot.LocationObject
		}

		// Score if had one hour break at least within 12 - 2 for lunch
		if had_lunch {
			score += 100
		} else {
			score -= 40
		}

	}

	// fmt.Println("Free Days:", freeDays)
	return score
}

// Helper functions

func BeforeOrEqual(t1 time.Time, t2 time.Time) bool {
	return t1.Before(t2) || t1.Equal(t2)
}
func AfterOrEqual(t1 time.Time, t2 time.Time) bool {
	return t1.After(t2) || t1.Equal(t2)
}

func PenaliseBigGaps(score *float32, start_time *time.Time, prev_end_time *time.Time) {
	// Penalise based on big gaps >= 1 hour unless its lunch time
	if (*start_time).Sub(*prev_end_time) >= time.Hour {
		*score -= 20 * float32((*start_time).Sub(*prev_end_time).Hours())
	} else {
		*score += 20
	}
}
