"use client"

import qs from "query-string";
import {usePathname , useRouter , useSearchParams} from "next/navigation"
import { PhoneCall , PhoneOff } from "lucide-react";
import { ActionToolTip } from "@/components/action-tooltip";

export const ChatAudioButton = () => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const isAudio = searchParams?.get("audio");

    const onClick = () => {
        const url = qs.stringifyUrl({
            url:pathname || "",
            query:{
                audio: isAudio ? undefined : true
            }
        },{skipNull: true})

        router.push(url);
    }

    const Icon = isAudio ? PhoneOff : PhoneCall;
    const tooltipLabel = isAudio ? "End call" : "Start Call";

    return (
        <ActionToolTip
        side="bottom"
        label={tooltipLabel}
        >
            <button
            className="hover:opacity-75 transition mr-4"
            onClick={onClick}
            >
                <Icon 
                className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                />
            </button>
        </ActionToolTip>
    )
}