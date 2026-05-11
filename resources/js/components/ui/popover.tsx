import * as React from "react"

import { cn } from "@/lib/utils"

const PopoverContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

function Popover({ children, open, onOpenChange, ...props }: React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    return (
        <PopoverContext.Provider value={{ open: open ?? false, onOpenChange: onOpenChange ?? (() => {}) }}>
            <div {...props}>{children}</div>
        </PopoverContext.Provider>
    )
}

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, style, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx.open) return null
    return (
        <div
            ref={ref}
            className={cn(
                "z-50 min-w-[16rem] overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-0 text-on-surface shadow-xl mt-2",
                className
            )}
            style={style}
            {...props}
        />
    )
})
PopoverContent.displayName = "PopoverContent"

function PopoverTrigger({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
    const ctx = React.useContext(PopoverContext)
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: () => ctx?.onOpenChange(!ctx.open),
        })
    }
    return (
        <button type="button" onClick={() => ctx?.onOpenChange(!ctx.open)} {...props}>
            {children}
        </button>
    )
}
PopoverTrigger.displayName = "PopoverTrigger"

export { Popover, PopoverContent, PopoverTrigger }