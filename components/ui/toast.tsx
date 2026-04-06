import * as React from "react"

export type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export type ToastActionElement = React.ReactElement<any, any>

const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps
>(({ className, title, description, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    >
      {title && <div className="toast-title">{title}</div>}
      {description && <div className="toast-description">{description}</div>}
    </div>
  )
})
Toast.displayName = "Toast"

export { Toast }
