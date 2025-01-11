"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client"
import { ActionToolTip } from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface props {
    label:string ,
    role?: MemberRole ,
    sectionType : "channels" | "members" ,
    channelType? : ChannelType ,
    server?: ServerWithMembersWithProfiles
};

export const ServerSection = ({
    label,
    role,
    sectionType ,
    channelType,
    server
}:props) => {

    const {onOpen} = useModal()

    return(
        <div
        className="flex items-center justify-between py-2"
        >
            <p className="text-xs uppercase font-semibold text-black dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionToolTip
                label="Create Channel"
                side="top"
                >
                    <button 
                    className="text-black hover:text-black dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    onClick={() => onOpen("createChannel",{server , channelType})}
                    >
                        <Plus className="h-4 w-4"/>
                    </button>
                </ActionToolTip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionToolTip
                label="Manage Members"
                side="top"
                >
                    <button 
                    className="text-black hover:text-black dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    onClick={() => onOpen("members",{server})}
                    >
                        <Settings className="h-4 w-4"/>
                    </button>
                </ActionToolTip>
            )}
            
        </div>
    )
}