import { Hash } from "lucide-react"
import { UserAvatar } from "../user-avatar"
import { SocketIndicator } from "@/components/socket-indicator"
import { ChatVideoButton } from "./chat-video"
import { ChatAudioButton } from "./chat-audio"

interface props{
    serverId:string,
    name:string,
    type: "channel" | "conversation"
    imageurl?: string
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageurl
}:props) => {
    return(
        <div
        className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2"
        >
            {type === "channel" && (
                <Hash 
                className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"
                />
            )}
            {type === "conversation" && (
                <UserAvatar 
                src={imageurl}
                className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}
            <p
            className="font-semibold text-md text-black dark:text-white"
            >
                {name}
            </p>
            <div
            className="ml-auto flex items-center"
            >
                {type === "conversation" && (
                    <>
                        <ChatVideoButton />
                        <ChatAudioButton />
                    </>
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}