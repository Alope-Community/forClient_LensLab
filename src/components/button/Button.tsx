import React from "react";
import { cn } from "../../utils/cn";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "tab";
    isActive?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isActive = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "cursor-pointer rounded-md font-medium transition-all text-center flex items-center justify-center gap-2",
                    variant === "primary" &&
                    "w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-inter text-sm py-3.5",
                    variant === "tab" && cn(
                        "py-2.5 text-xs font-semibold px-4",
                        isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    ),

                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";