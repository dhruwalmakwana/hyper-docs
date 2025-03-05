"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { templates } from "@/constants/templates";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react"; // Icons

export const TemplatesGallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const [isCreating, setIsCreating] = useState(false);

    const onTemplateClick = (title: string, initialContent: string) => {
        setIsCreating(true);
        create({ title, initialContent })
            .catch(() => toast.error("Something went wrong!"))
            .then((documentId) => {
                router.push(`/documents/${documentId}`);
                toast.success("Document Created!");
            })
            .finally(() => setIsCreating(false));
    };

    return (
        <>
            {/* Button to Open Modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
                <PlusIcon size={20} />
                Create Document
            </button>

            {/* Modal for Templates */}
            <Transition show={isOpen} as="div">
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    {/* Background Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />

                    {/* Centered Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as="div"
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-semibold">Choose a Template</h3>
                                <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-red-500">
                                    <XIcon size={24} />
                                </button>
                            </div>

                            {/* Templates Carousel */}
                            <div className="mt-4">
                                <Carousel>
                                    <CarouselContent>
                                        {templates.map((template) => (
                                            <CarouselItem key={template.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 p-2">
                                            <div className="flex flex-col items-center">
                                                {/* Template Image */}
                                                <button
                                                    disabled={isCreating}
                                                    onClick={() => onTemplateClick(template.label, template.initialContent)}
                                                    className="w-full aspect-[3/4] bg-gray-200 rounded-md border hover:border-blue-500 transition-transform transform hover:scale-105"
                                                    style={{
                                                        backgroundImage: `url('${template.imageURL}')`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        backgroundRepeat: "no-repeat",
                                                    }}
                                                />
                                                {/* Template Name */}
                                                <p className="mt-2 text-sm font-medium text-center truncate w-full">
                                                    {template.label}
                                                </p>
                                            </div>
                                        </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

