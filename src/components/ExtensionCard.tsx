import React from "react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ExtensionCardProps {
  id: string;
  name: string;
  enabled: boolean;
  icon: string | undefined;
  onToggle: (id: string) => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({
  id,
  name,
  enabled,
  icon,
  onToggle,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-lg border cursor-pointer hover:shadow-sm hover:border-gray-300",
              !enabled && "opacity-50"
            )}
            onClick={() => onToggle(id)}
          >
            {icon && (
              <img
                src={icon}
                alt={name}
                className={cn("w-6 h-6", !enabled && "filter grayscale")}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExtensionCard;
