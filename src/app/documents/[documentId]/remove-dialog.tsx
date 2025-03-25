"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RemoveDialogProps {
    documentId: Id<"documents">;
    children: React.ReactNode;
};

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        setIsRemoving(true);
        remove({ id: documentId })
            .catch(() => toast.error("Something went wrong!"))
            .then(() => {
                toast.success("Document Removed!")
                router.push('/');
            })
            .finally(() => {
                setIsRemoving(false);
                setOpen(false);
            });
    };

    return (
        <AlertDialog 
            open={open} 
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isRemoving}
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}; 