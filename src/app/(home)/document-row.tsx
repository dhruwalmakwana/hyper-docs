import { TableCell, TableRow } from "@/components/ui/table";
import { Doc } from "../../../convex/_generated/dataModel";
import { Building2Icon, CircleUserIcon, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { DocumentMenu } from "./document-menu";
import { useRouter } from "next/navigation";


interface DocumentRowProps {
    document: Doc<"documents">;
};

export const DocumentRow = ({ document }: DocumentRowProps) => {

    const router = useRouter();

    return (
        <TableRow
            className="cursor-pointer ">
            <TableCell onClick={() => router.push(`/documents/${document?._id}`)} className="w-[50px] ">
                <FileIcon className="size-8 fill-blue-500 stroke-white stroke-1" />
            </TableCell>
            <TableCell onClick={() => router.push(`/documents/${document?._id}`)} className="font-medium md:w-[45%]">
                {document.title}
            </TableCell>
            <TableCell onClick={() => router.push(`/documents/${document?._id}`)} className="text-muted-foreground hidden md:flex items-center gap-2">
                {
                    document.organizationId
                        ? <Building2Icon className="size-4" />
                        : <CircleUserIcon className="size-4" />
                }
                {
                    document.organizationId ? "Organization" : "Personal"
                }
            </TableCell>
            <TableCell onClick={() => router.push(`/documents/${document?._id}`)} className="text-muted-foreground hidden md:table-cell">
                {document._creationTime
                    ? format(new Date(document._creationTime), "MMM dd, yyyy")
                    : "Unknown Date"}

            </TableCell>
            <TableCell className="flex ml-auto justify-end">
                <DocumentMenu
                    documentId={document._id}
                    title={document.title}
                    onNewTab={() => window.open(`/documents/${document._id}`, "_blank")}
                />
            </TableCell>
        </TableRow>
    );
};