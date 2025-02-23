"use client";

import { Button } from "@/components/ui/button";
import { RemoveDialog } from "@/components/remove-document";
import { ExternalLinkIcon, MoreVertical, TrashIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Id } from "../../../convex/_generated/dataModel";


interface DocumentMenuProps {
    documentId: Id<"documents">;
    title: string,
    onNewTab: (id: Id<"documents">) => void;
};

export const DocumentMenu = ({ documentId, title, onNewTab }: DocumentMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="size-4 " />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <RemoveDialog documentId={documentId}> 
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        // onClick={(e) => e.preventDefault()}
                    >
                        <TrashIcon className="size-4 mr-2"/>
                        Remove
                    </DropdownMenuItem>
                </RemoveDialog>
                <DropdownMenuItem onClick={() => onNewTab(documentId)}>
                    <ExternalLinkIcon className="mr-2 size-4" />
                    Open in new tab
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};