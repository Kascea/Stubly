import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";

export default function FlashMessage() {
  const { props } = usePage();
  const { toast } = useToast();

  useEffect(() => {
    if (props?.flash?.success) {
      toast({
        variant: "default",
        title: "Success",
        description: props.flash.success,
      });
    }
    if (props?.flash?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: props.flash.error,
      });
    }
  }, [props.flash]);

  return <Toaster />;
}
