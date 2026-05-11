import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FileInputProps {
    name: string
    accept?: string
    label?: string
    hint?: string
    value?: string
    onValueChange?: (preview: string) => void
    errors?: Record<string, string>
}

function FileInput({
    name,
    accept,
    label,
    hint,
    value,
    onValueChange,
    errors,
}: FileInputProps) {
    const [preview, setPreview] = React.useState<string>(value || "")
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setPreview(result)
            onValueChange?.(result)
        }
        reader.readAsDataURL(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    const clear = () => {
        setPreview("")
        if (inputRef.current) inputRef.current.value = ""
        onValueChange?.("")
    }

    return (
        <div className="space-y-3">
            {label && (
                <Label className="text-xs font-bold tracking-wider text-secondary uppercase">
                    {label}
                </Label>
            )}
            {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-lowest",
                    preview && "border-solid"
                )}
            >
                {preview ? (
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-24 w-24 rounded-lg object-cover border border-outline-variant"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                clear()
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">
                            cloud_upload
                        </span>
                        <p className="text-sm text-on-surface-variant text-center">
                            <span className="font-semibold text-on-surface">Click to upload</span> or drag and drop
                        </p>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>

            {errors?.[name] && (
                <p className="text-xs font-medium text-error">{errors[name]}</p>
            )}
        </div>
    )
}

export { FileInput }