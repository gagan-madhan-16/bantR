"use client"

import { cn } from "@/lib/utils";
import { ChannelType , Channel, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic,   Trash,   Video } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { ActionToolTip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface props{
    channel: Channel,
    server: Server,
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT] : Hash,
    [ChannelType.AUDIO] : Mic,
    [ChannelType.VEDIO] : Video
}


export const ServerChannel = ({
    server,
    channel,
    role
}:props) => {
    
    const params = useParams();
    const router = useRouter();
    const {onOpen} = useModal();
    
    const onClick = () => {
        router.push(`/servers/${params.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server });
      };
      

    const Icon = iconMap[channel.type];

    return(
        <button
        onClick={onClick}
        className={cn( 
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
            params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-black dark:text-zinc-400"/>

            <p
            className={cn(
                'line-clamp-1 font-semibold text-sm text-black group-hover:text-black dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white "
            )}
            >
                {channel.name}
            </p>
            {channel.name !== "general"  && role!== MemberRole.GUEST && (
                <div className="ml-auto flex items-start gap-x-2">
                    <ActionToolTip
                    label="Edit"
                    >
                        <Edit 
                        className="h-4 w-4 hidden group-hover:block text-black hover:text-black dark:text-zinc-400 dark:hover-text-zinc-300 transition"
                        onClick={(e) => onAction(e,"editChannel")}
                        />
                    </ActionToolTip>
                    <ActionToolTip
                    label="Delete"
                    >
                        <Trash 
                        onClick={(e) => onAction(e,"deleteChannel")}
                        className="h-4 w-4 hidden group-hover:block text-black hover:text-black dark:text-zinc-400 dark:hover-text-zinc-300 transition"
                        />
                    </ActionToolTip>
                </div>
            )}
            {channel.name === "general"  && (
                <Lock
                className="ml-auto w-4 h-4 text-black dark:text-zinc-400"
                />
            )}
        </button>
    )
}