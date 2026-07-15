"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DropdownAction {
    label: string;
    icon: React.ReactElement | React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
    separatorBefore?: boolean;
    disabled?: boolean;
}

interface ActionsDropdownProps {
    actions: DropdownAction[];
}

export function ActionsDropdown({
    actions,
}: ActionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-md border border-transparent hover:border-border/60 hover:bg-surface-hover text-text-secondary hover:text-text transition-all duration-200 data-[state=open]:bg-surface-hover data-[state=open]:text-text"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-48 rounded-md border border-border/80 bg-surface p-1 shadow-md"
            >
                {actions.map((action, index) => (
                    <div key={index}>
                        {action.separatorBefore && (
                            <DropdownMenuSeparator className="my-1 h-px bg-border-light" />
                        )}

                        <DropdownMenuItem
                            disabled={action.disabled}
                            onClick={action.onClick}
                            className={`flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors
                ${action.variant === "destructive"
                                    ? "text-danger focus:bg-danger/10 focus:text-danger"
                                    : "text-text focus:bg-surface-hover focus:text-secondary"
                                }`}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}