import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border border-slate-200 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 [&>svg~*]:pl-7 dark:border-slate-800 dark:[&>svg]:text-slate-50",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4",
      {
        "bg-sky-50/50 border-sky-100": variant === "default",
        "bg-green-50/50 border-green-100": variant === "success",
        "bg-red-50/50 border-red-100": variant === "error",
      },
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div className="flex items-center gap-3">
    {variant === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
    {variant === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
    <div
      ref={ref}
      className={cn(
        "text-sm [&_p]:leading-relaxed",
        {
          "text-sky-800": variant === "default",
          "text-green-800": variant === "success",
          "text-red-800": variant === "error",
        },
        className
      )}
      {...props}
    />
  </div>
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
