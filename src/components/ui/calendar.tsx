"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Helper functions for date manipulation
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month, 1).getDay()
}

const getWeekDays = (date: Date) => {
  const currentDate = new Date(date)
  currentDate.setHours(0, 0, 0, 0)
  const day = currentDate.getDay()
  const diff = currentDate.getDate() - day
  
  const weekStart = new Date(currentDate)
  weekStart.setDate(diff)
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push({
      date: day,
      isOutside: day.getMonth() !== date.getMonth(),
      isToday: day.toDateString() === new Date().toDateString()
    })
  }
  
  return days
}

const getWeeksInMonth = (date: Date, showOutsideDays: boolean) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()
  
  const weeks = []
  
  let currentDate = new Date(firstDay)
  if (showOutsideDays) {
    currentDate.setDate(currentDate.getDate() - firstDayOfWeek)
  }
  
  while (currentDate <= lastDay || (showOutsideDays && weeks.length < 6)) {
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      if (currentDate.getMonth() === month || showOutsideDays) {
        weekDays.push({
          date: new Date(currentDate),
          isOutside: currentDate.getMonth() !== month,
          isToday: currentDate.toDateString() === new Date().toDateString()
        })
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(weekDays)
  }
  
  return weeks
}

const getDaysArray = (date: Date, showOutsideDays: boolean) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = getDaysInMonth(date)
  const firstDayOfMonth = getFirstDayOfMonth(date)
  
  const days = []
  
  // Add previous month days if showing outside days
  if (showOutsideDays) {
    const prevMonth = new Date(year, month - 1)
    const prevMonthDays = getDaysInMonth(prevMonth)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - firstDayOfMonth + i + 1),
        isOutside: true,
        isToday: false
      })
    }
  }
  
  // Add current month days
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i)
    currentDate.setHours(0, 0, 0, 0)
    days.push({
      date: currentDate,
      isOutside: false,
      isToday: currentDate.getTime() === today.getTime()
    })
  }
  
  // Add next month days to complete the grid (if needed)
  if (showOutsideDays) {
    const totalDaysShown = days.length
    const remainingDays = 42 - totalDaysShown // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isOutside: true,
        isToday: false
      })
    }
  }
  
  return days
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export type CalendarProps = {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  mode?: 'single' | 'range' | 'multiple'
  selected?: Date | Date[] | { from: Date; to: Date }
  onSelect?: (date: Date | undefined) => void
  disabled?: { from: Date; to: Date }[] | ((date: Date) => boolean)
  defaultMonth?: Date
  defaultView?: 'day' | 'week' | 'month'
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = 'single',
  selected,
  onSelect,
  disabled,
  defaultMonth,
  defaultView = 'month',
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(defaultMonth || new Date())
  const [view, setView] = React.useState<'day' | 'week' | 'month'>(defaultView)
  const [selectedWeek, setSelectedWeek] = React.useState<Date>(new Date())
  
  const isDateSelected = (date: Date) => {
    if (!selected) return false
    
    if (mode === 'single' && selected instanceof Date) {
      return date.getTime() === selected.getTime()
    } else if (mode === 'range' && typeof selected === 'object' && 'from' in selected && 'to' in selected) {
      const time = date.getTime()
      return time >= selected.from.getTime() && time <= selected.to.getTime()
    } else if (mode === 'multiple' && Array.isArray(selected)) {
      return selected.some(selectedDate => selectedDate.getTime() === date.getTime())
    }
    
    return false
  }
  
  const isDateDisabled = (date: Date) => {
    if (!disabled) return false
    
    if (typeof disabled === 'function') {
      return disabled(date)
    } else if (Array.isArray(disabled)) {
      return disabled.some(range => {
        const time = date.getTime()
        return time >= range.from.getTime() && time <= range.to.getTime()
      })
    }
    
    return false
  }
  
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return
    if (onSelect) onSelect(date)
  }
  
  const isRangeStart = (date: Date) => {
    if (mode !== 'range' || !selected || typeof selected !== 'object' || !('from' in selected) || !selected.from) return false
    return date.getTime() === selected.from.getTime()
  }
  
  const isRangeEnd = (date: Date) => {
    if (mode !== 'range' || !selected || typeof selected !== 'object' || !('to' in selected) || !selected.to) return false
    return date.getTime() === selected.to.getTime()
  }
  
  const isRangeMiddle = (date: Date) => {
    if (mode !== 'range' || !selected || typeof selected !== 'object' || !('from' in selected) || !('to' in selected) || !selected.from || !selected.to) return false
    const time = date.getTime()
    return time > selected.from.getTime() && time < selected.to.getTime()
  }
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (view === 'day') {
        newDate.setDate(prev.getDate() - 1)
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() - 7)
      } else {
        newDate.setMonth(prev.getMonth() - 1)
      }
      return newDate
    })
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (view === 'day') {
        newDate.setDate(prev.getDate() + 1)
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() + 7)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const renderDayView = () => {
    const dayDate = currentMonth
    const formattedDate = dayDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    return (
      <div className={cn("space-y-4", classNames?.month)}>
        <div className={cn("flex justify-center pt-1 relative items-center", classNames?.caption)}>
          <span className={cn("text-sm font-medium", classNames?.caption_label)}>{formattedDate}</span>
          <div className={cn("space-x-1 flex items-center", classNames?.nav)}>
            <button
              onClick={goToPreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_previous,
                "absolute left-1"
              )}
            >
              <ChevronLeft className={cn("h-4 w-4")} />
            </button>
            <button
              onClick={goToNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_next,
                "absolute right-1"
              )}
            >
              <ChevronRight className={cn("h-4 w-4")} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 border rounded-md">
          <div className="text-2xl font-semibold">{dayDate.getDate()}</div>
          <button
            onClick={() => handleDateSelect(dayDate)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "mt-2 h-10 px-4",
              isDateSelected(dayDate) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              dayDate.toDateString() === new Date().toDateString() && "bg-accent text-accent-foreground"
            )}
            disabled={isDateDisabled(dayDate)}
          >
            Select
          </button>
        </div>
      </div>
    )
  }
  
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentMonth)
    const weekStart = weekDays[0].date
    const weekEnd = weekDays[6].date
    const formattedWeek = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    
    return (
      <div className={cn("space-y-4", classNames?.month)}>
        <div className={cn("flex justify-center pt-1 relative items-center", classNames?.caption)}>
          <span className={cn("text-sm font-medium", classNames?.caption_label)}>{formattedWeek}</span>
          <div className={cn("space-x-1 flex items-center", classNames?.nav)}>
            <button
              onClick={goToPreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_previous,
                "absolute left-1"
              )}
            >
              <ChevronLeft className={cn("h-4 w-4")} />
            </button>
            <button
              onClick={goToNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_next,
                "absolute right-1"
              )}
            >
              <ChevronRight className={cn("h-4 w-4")} />
            </button>
          </div>
        </div>
        
        <div className={cn("w-full border-collapse", classNames?.table)}>
          <div className={cn("flex", classNames?.head_row)}>
            {WEEKDAYS.map(weekday => (
              <div 
                key={weekday}
                className={cn("text-muted-foreground rounded-md flex-1 text-center font-normal text-[0.8rem]", classNames?.head_cell)}
              >
                {weekday}
              </div>
            ))}
          </div>
          
          <div className={cn("flex w-full mt-2", classNames?.row)}>
            {weekDays.map((day, index) => {
              const isSelected = isDateSelected(day.date)
              const isDisabled = isDateDisabled(day.date)
              const dayClassName = cn(
                buttonVariants({ variant: "ghost" }),
                "h-14 flex-1 p-0 font-normal aria-selected:opacity-100",
                classNames?.day,
                day.isOutside && cn("day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground", classNames?.day_outside),
                day.isToday && cn("bg-accent text-accent-foreground", classNames?.day_today),
                isSelected && cn("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", classNames?.day_selected),
                isDisabled && cn("text-muted-foreground opacity-50", classNames?.day_disabled),
                isRangeStart(day.date) && cn("day-range-start", classNames?.day_range_start),
                isRangeEnd(day.date) && cn("day-range-end", classNames?.day_range_end),
                isRangeMiddle(day.date) && cn("aria-selected:bg-accent aria-selected:text-accent-foreground", classNames?.day_range_middle)
              )
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center justify-center p-1 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                    isSelected && "bg-accent"
                  )}
                >
                  <span className="text-xs text-muted-foreground">{WEEKDAYS[index]}</span>
                  <button
                    type="button"
                    className={dayClassName}
                    disabled={isDisabled}
                    aria-selected={isSelected}
                    onClick={() => handleDateSelect(day.date)}
                  >
                    {day.date.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  
  const renderMonthView = () => {
    const days = getDaysArray(currentMonth, showOutsideDays)
    const monthYearString = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    return (
      <div className={cn("space-y-4", classNames?.month)}>
        <div className={cn("flex justify-center pt-1 relative items-center", classNames?.caption)}>
          <span className={cn("text-sm font-medium", classNames?.caption_label)}>{monthYearString}</span>
          <div className={cn("space-x-1 flex items-center", classNames?.nav)}>
            <button
              onClick={goToPreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_previous,
                "absolute left-1"
              )}
            >
              <ChevronLeft className={cn("h-4 w-4")} />
            </button>
            <button
              onClick={goToNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                classNames?.nav_button,
                classNames?.nav_button_next,
                "absolute right-1"
              )}
            >
              <ChevronRight className={cn("h-4 w-4")} />
            </button>
          </div>
        </div>
        
        <div className={cn("w-full border-collapse space-y-1", classNames?.table)}>
          <div className={cn("flex", classNames?.head_row)}>
            {WEEKDAYS.map(weekday => (
              <div 
                key={weekday}
                className={cn("text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]", classNames?.head_cell)}
              >
                {weekday}
              </div>
            ))}
          </div>
          
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, rowIndex) => (
            <div 
              key={rowIndex}
              className={cn("flex w-full mt-2", classNames?.row)}
            >
              {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((day, cellIndex) => {
                const isSelected = isDateSelected(day.date)
                const isDisabled = isDateDisabled(day.date)
                const dayClassName = cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                  classNames?.day,
                  day.isOutside && cn("day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground", classNames?.day_outside),
                  day.isToday && cn("bg-accent text-accent-foreground", classNames?.day_today),
                  isSelected && cn("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", classNames?.day_selected),
                  isDisabled && cn("text-muted-foreground opacity-50", classNames?.day_disabled),
                  isRangeStart(day.date) && cn("day-range-start", classNames?.day_range_start),
                  isRangeEnd(day.date) && cn("day-range-end", classNames?.day_range_end),
                  isRangeMiddle(day.date) && cn("aria-selected:bg-accent aria-selected:text-accent-foreground", classNames?.day_range_middle)
                )
                
                return (
                  <div
                    key={cellIndex}
                    className={cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                      mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                      classNames?.cell
                    )}
                  >
                    <button
                      type="button"
                      className={dayClassName}
                      disabled={isDisabled}
                      aria-selected={isSelected}
                      onClick={() => handleDateSelect(day.date)}
                    >
                      {day.date.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center mb-4">
        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as 'day' | 'week' | 'month')}>
          <ToggleGroupItem value="day" aria-label="Day view">
            Day
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Week view">
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Month view">
            Month
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className={cn("flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0", classNames?.months)}>
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
// "use client"

// import * as React from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { DayPicker } from "react-day-picker"

// import { cn } from "@/lib/utils"
// import { buttonVariants } from "@/components/ui/button"

// export type CalendarProps = React.ComponentProps<typeof DayPicker>

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell:
//           "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: cn(
//           "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
//           props.mode === "range"
//             ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
//             : "[&:has([aria-selected])]:rounded-md"
//         ),
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_range_start: "day-range-start",
//         day_range_end: "day-range-end",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
//         day_disabled: "text-muted-foreground opacity-50",
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: ({ className, ...props }) => (
//           <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
//         ),
//         IconRight: ({ className, ...props }) => (
//           <ChevronRight className={cn("h-4 w-4", className)} {...props} />
//         ),
//       }}
//       {...props}
//     />
//   )
// }
// Calendar.displayName = "Calendar"

// export { Calendar }
