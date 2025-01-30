import React from "react";
import { Button } from "@/Components/ui/button";
import { Share2, Link as LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function ShareDropdown({ title, text, url }) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      // Only copy link if Web Share API is not supported
      if (error.name === "NotSupportedError") {
        handleCopyLink();
      }
      // Do nothing if user cancelled the share
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The ticket link has been copied to your clipboard.",
      className: "bg-green-500 border-green-600 text-white",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share ticket
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
