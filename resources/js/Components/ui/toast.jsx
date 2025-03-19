import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const Toast = ({ toast, onClose }) => {
  const { id, title, description, variant = "default" } = toast;

  const variantStyles = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  };

  const variantIcon = {
    default: null,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md rounded-lg border shadow-lg p-4 mb-2",
        variantStyles[variant]
      )}
      role="alert"
    >
      {variantIcon[variant] && (
        <div className="flex-shrink-0 mr-3">{variantIcon[variant]}</div>
      )}
      <div className="flex-1">
        {title && <h3 className="font-medium">{title}</h3>}
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
      <button
        type="button"
        className="ml-4 inline-flex flex-shrink-0 text-gray-400 hover:text-gray-500"
        onClick={() => onClose(id)}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, setToasts }) => {
  const handleClose = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
