"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { api } from "../../../../convex/_generated/api";
import { AITools } from "./ai-tools";

interface DocumentProps {
    preLoadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preLoadedDocument }: DocumentProps) => {
    
    const document = usePreloadedQuery(preLoadedDocument);

    return (
        <Room>
            <div className="min-h-screen bg-[#FAFBFD]">
                <div className="flex flex-col px-4 pt-2 gap-y-2 fixed  top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden ">
                    <Navbar data={document}/>
                    <Toolbar />
                </div>
                <div className="pt-[190px] md:pt-[100px] pb-[80px] print:pt-0">
                    <Editor initialContent={document.initialContent}/>
                </div>
                <AITools />
            </div>
        </Room>
    );
}