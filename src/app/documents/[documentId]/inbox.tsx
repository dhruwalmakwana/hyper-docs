"use client";

import { Button } from "@/components/ui/button";
import { ClientSideSuspense, useInboxNotifications } from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { BellIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Inbox = () => {
    return (
        <ClientSideSuspense fallback={
            <>
                <Button
                    disabled
                    variant="ghost"
                    className="relative"
                    size="icon"
                >
                    <BellIcon className="size-5" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
            </>
        }>
            <InboxMenu />
        </ClientSideSuspense>
    );
};

const InboxMenu = () => {

    const { inboxNotifications } = useInboxNotifications();

    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative"
                        size="icon"
                    >
                        <BellIcon className="size-5" />
                        {inboxNotifications?.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-600 text-xs text-white flex items-center justify-center">
                                {inboxNotifications.length}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-auto max-w-[300px] md:max-w-screen-md overflow-y-auto"
                >
                    {inboxNotifications.length > 0 ? (
                        <InboxNotificationList className="break-words whitespace-normal">
                            {inboxNotifications.map((inboxNotification) => (
                                <InboxNotification
                                    key={inboxNotification.id}
                                    inboxNotification={inboxNotification}
                                    className="p-2 break-words whitespace-normal"
                                />
                            ))}
                        </InboxNotificationList>
                    ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground bg-white rounded-full shadow-inner">
                            No Notifications
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" className="h-6" />
        </>
    );
};