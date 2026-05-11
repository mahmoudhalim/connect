import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerSimpleProps {
    name: string
    label?: string
    value?: string
    defaultValue?: string
    errors?: Record<string, string>
}

export function DatePickerSimple({ name, label, value, defaultValue, errors }: DatePickerSimpleProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        defaultValue ? new Date(defaultValue) : value ? new Date(value) : undefined
    )

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        setOpen(false)
        if (selectedDate) {
            const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]`)
            if (input) {
                input.value = selectedDate.toISOString().split("T")[0]
                input.dispatchEvent(new Event("change", { bubbles: true }))
            }
        }
    }

    return (
        <Field>
            {label && <FieldLabel className="text-xs font-bold tracking-wider text-secondary uppercase">{label}</FieldLabel>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        type="button"
                        className="justify-start font-normal w-full bg-surface-container-lowest"
                    >
                        {date ? date.toLocaleDateString() : "Select date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        onSelect={handleSelect}
                    />
                </PopoverContent>
            </Popover>
            <input type="hidden" name={name} defaultValue={defaultValue || value || ""} />
            {errors?.[name] && <p className="text-xs font-medium text-error">{errors[name]}</p>}
        </Field>
    )
}