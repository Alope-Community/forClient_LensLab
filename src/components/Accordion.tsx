import React, { useState } from "react";
import { IconChevronDown } from "justd-icons";

interface AccordionProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export function Accordion({ title, content, icon }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-lg bg-surface overflow-hidden transition-all duration-300">
      <button 
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-tertiary">{icon}</span>}
          <span className="font-grotesk font-semibold text-sm tracking-wide text-white uppercase">{title}</span>
        </div>
        <IconChevronDown 
          className={`w-4 h-4 text-tertiary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 text-[13px] text-tertiary font-inter leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
