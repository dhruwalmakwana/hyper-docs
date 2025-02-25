"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { templates } from "@/constants/templates";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export const TemplatesGallery = () => {
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const [isCreating, setIsCreating] = useState(false);


    const onTemplateClick = (title: string, initialContent: string) => {
        setIsCreating(true);
        create({ title, initialContent })
            .catch(() => toast.error("Something went wrong!"))
            .then((documentId) => {
                router.push(`/documents/${documentId}`);
                toast.success("Document Created!")
            })
            .finally(() => {
                setIsCreating(false);
            });
    };
    return (
        <div className="bg-[#F1F3f4]">
            <div className="max-w-screen-xl mx-auto px-16 py-16 flex flex-col gap-y-4">
                <h3 className="font-medium">Start new Document</h3>
                <Carousel>
                    <CarouselContent className="ml-4">
                        {
                            templates.map((template) => (
                                <CarouselItem
                                    key={template.id}
                                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7 pl-4"
                                >
                                    <div
                                        className={cn(
                                            "overflow-visible aspect-[3/4] flex flex-col gap-y-2.5 mt-2",
                                            isCreating && "pointer-events-none opacity-50"
                                        )}
                                    >
                                        <button
                                            disabled={isCreating}
                                            onClick={() => onTemplateClick(template.label, "")}  // TODO: Add proper initail content
                                            style={{
                                                backgroundImage: `url('${template.imageURL}')`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                            className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition-transform transform hover:scale-105 flex flex-col items-center justify-center gap-y-4 bg-white"
                                        />
                                        <p className="text-sm font-medium truncate">
                                            {template.label}
                                        </p>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselNext />
                    <CarouselPrevious />
                </Carousel>
            </div>
        </div>
    );
};

