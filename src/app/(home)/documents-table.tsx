import { LoaderIcon } from "lucide-react";
import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";

interface DocumentsTableProps {
    documents: Doc<"documents">[] | undefined;
    loadMore: (numItems: number) => void;
    status: PaginationStatus;
};

export const DocumentsTable = ({ documents, loadMore, status }: DocumentsTableProps) => {

    documents?.sort((a, b) => {
        return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime()
    });
    
    return (
        <div
            className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
            {documents === undefined ? (
                <div className="justify-normal flex items-center h-24">
                    <LoaderIcon className="animate-spin text-muted-foreground size-5" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead>Name</TableHead>
                            <TableHead>&nbsp;</TableHead>
                            <TableHead className="hidden md:table-cell">Shared</TableHead>
                            <TableHead className="hidden md:table-cell">Created at</TableHead>
                        </TableRow>
                    </TableHeader>
                    {documents.length === 0 ? (
                        <TableBody>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No Documents Found
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>

                            {documents.map((document) => {
                                return (
                                    <DocumentRow key={document._id} document={document} />
                                )
                            })}
                        </TableBody>
                    )}
                </Table>
            )}
            <div className="flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMore(5)}
                    disabled={status !== "CanLoadMore"}>
                    {status === "CanLoadMore" ? "Load More" : "End of results"}
                </Button>
            </div>
        </div>
    );
};