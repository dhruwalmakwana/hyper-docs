import { TableCell, TableRow } from "@/components/ui/table";
import { Doc } from "../../../convex/_generated/dataModel";
import { Building2Icon, CircleUserIcon, FileIcon, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";


interface DocumentRowProps {
    document: Doc<"documents"> | undefined;
};

export const DocumentRow = ({ document }: DocumentRowProps) => {
    return (
        <TableRow className="cursor-pointer ">
            <TableCell className="w-[50px] ">
                <FileIcon className="size-8 fill-blue-500 stroke-white stroke-1" />
            </TableCell>
            <TableCell className="font-medium md:w-[45%]">
                {document?.title}
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
                {
                    document?.organizationId
                        ? <Building2Icon className="size-4" />
                        : <CircleUserIcon className="size-4" />
                }
                {
                    document?.organizationId ? "Organization" : "Personal"
                }
            </TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
                {format(new Date(document?._creationTime), "MMM dd, yyyy")}
            </TableCell>
            <TableCell className="flex ml-auto justify-end">
                <Button variant="ghost" size="icon" className="rounded-full">  
                    <MoreVertical className="size-4 "/>
                </Button>
            </TableCell>
        </TableRow>
    );
};