import React from 'react';
import { Tooltip as TooltipContainer, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IconType } from 'react-icons';

interface TooltipProps {
  text: string;
  Trigger: IconType | string;
  className: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, Trigger, className }) => {
  return (
    <TooltipProvider>
      <TooltipContainer>
        <TooltipTrigger asChild>
          <button type='button' className={className}>
            <Trigger />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </TooltipContainer>
    </TooltipProvider>
  );
};

export default Tooltip;
