"use client";

import { LucideIcon, UndoIcon, RedoIcon, PrinterIcon, SpellCheckIcon, BoldIcon, ItalicIcon, UnderlineIcon, MessageSquarePlusIcon, ListTodoIcon, RemoveFormattingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { FontFamilyButton, HeadingLevelButton, FontSizeButton, TextColorButton, HighlightColorButton, ListButton, LineHeightButton, AlignButton, LinkButton, ImageButton } from "./tools";

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

const ToolbarButton = ({ 
    onClick,
    isActive,
    icon :Icon,
 } : ToolbarButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80"
            )}
        >
            <Icon className="size-4"/>
        </button>
    );
}

export const Toolbar = () => {
    const { editor } = useEditorStore();

    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
        [
            { label: 'Undo', icon: UndoIcon, onClick: () => editor?.chain().focus().undo().run() },
            { label: 'Redo', icon: RedoIcon, onClick: () => editor?.chain().focus().redo().run() },
            { label: 'Print', icon: PrinterIcon, onClick: () => window.print() },
            {
                label: 'Spell Check',
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute('spellcheck');
                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
                },
            }
        ],
        [
            { label: 'Bold', icon: BoldIcon, isActive: editor?.isActive("bold"), onClick: () => editor?.chain().focus().toggleBold().run() },
            { label: 'Italic', icon: ItalicIcon, isActive: editor?.isActive("italic"), onClick: () => editor?.chain().focus().toggleItalic().run() },
            { label: 'Underline', icon: UnderlineIcon, isActive: editor?.isActive("underline"), onClick: () => editor?.chain().focus().toggleUnderline().run() },
        ],
        [
            { label: 'Comment', icon: MessageSquarePlusIcon, isActive: editor?.isActive("liveblocksCommentMarks"), onClick: () => editor?.chain().focus().addPendingComment().run() },
            { label: 'To Do', icon: ListTodoIcon, isActive: editor?.isActive("taskList"), onClick: () => editor?.chain().focus().toggleTaskList().run() },
            { label: 'Remove Formatting', icon: RemoveFormattingIcon, onClick: () => editor?.chain().focus().unsetAllMarks().run() }
        ]
    ];

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#F1F4F9] px-4 py-2 rounded-full shadow-lg min-h-[40px] flex items-center gap-x-1 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <FontFamilyButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <HeadingLevelButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <FontSizeButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            {sections[1].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
            <TextColorButton />
            <HighlightColorButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            <LinkButton />
            <ImageButton />
            <AlignButton />
            <LineHeightButton />
            <ListButton />
            {sections[2].map((item) => (
                <ToolbarButton key={item.label} {...item} />
            ))}
        </div>
    );
};
