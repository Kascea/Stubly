import { Button } from "@/Components/ui/button";

export const PrimaryButton = ({ children, className = "", ...props }) => (
  <Button
    className={`bg-sky-800 hover:bg-sky-700 text-white transition-colors ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export const SecondaryButton = ({ children, className = "", ...props }) => (
  <Button
    variant="outline"
    className={`border-sky-200 text-sky-900 hover:text-sky-800 hover:bg-sky-50 transition-colors ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export const DangerButton = ({ children, className = "", ...props }) => (
  <Button
    variant="outline"
    className={`border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export const GhostButton = ({ children, className = "", ...props }) => (
  <Button
    variant="ghost"
    className={`text-sky-900 hover:text-orange-400 hover:bg-orange-50 transition-colors ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export const OrangeButton = ({ children, className = "", ...props }) => (
  <Button
    className={`bg-orange-500 hover:bg-orange-600 text-white transition-colors ${className}`}
    {...props}
  >
    {children}
  </Button>
);
