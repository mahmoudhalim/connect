import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CalendarProps = {
    mode?: "single" | "multiple" | "range"
    selected?: Date | Date[] | null
    defaultMonth?: Date
    captionLayout?: "dropdown" | "labels"
    onSelect?: (date: Date | undefined) => void
    className?: string
}

function Calendar({ mode = "single", selected, defaultMonth, captionLayout, onSelect, className }: CalendarProps) {
    const [month, setMonth] = React.useState(defaultMonth || new Date())
    const selectedDate = mode === "single" ? (selected as Date | null | undefined) : (selected as Date[] | undefined)?.[0]

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

    const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
    const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))

    const isSelected = (day: number) => {
        return selectedDate?.toDateString() === new Date(month.getFullYear(), month.getMonth(), day).toDateString()
    }

    return (
        <div className={cn("p-3", className)}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} type="button" className="p-1 rounded hover:bg-surface-container-highest">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-sm font-medium capitalize">
                    {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={nextMonth} type="button" className="p-1 rounded hover:bg-surface-container-highest">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((d) => (
                    <div key={d} className="text-center text-xs text-on-surface-variant font-medium py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const date = new Date(month.getFullYear(), month.getMonth(), day)
                    const selected = isSelected(day)
                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => onSelect?.(date)}
                            className={cn(
                                "h-8 w-8 rounded-full text-sm transition-colors",
                                selected
                                    ? "bg-primary text-on-primary font-semibold"
                                    : "hover:bg-surface-container-highest text-on-surface"
                            )}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export { Calendar }