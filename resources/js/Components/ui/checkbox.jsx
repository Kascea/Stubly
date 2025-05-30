import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, variant = "sky", ...props }, ref) => {
  const variants = {
    sky: "border-slate-200 bg-sky-50 data-[state=checked]:bg-sky-800 hover:bg-sky-100",
    orange: "border-slate-200 bg-orange-50 data-[state=checked]:bg-orange-500 hover:bg-orange-100",
    purple: "border-slate-200 bg-purple-50 data-[state=checked]:bg-purple-600 hover:bg-purple-100",
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border-2 shadow-sm",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator 
        className={cn(
          "flex items-center justify-center text-white",
          "animate-in zoom-in-50 duration-200"
        )}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }