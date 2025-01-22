import { Member } from "@prisma/client";
import { InfiniteData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface props {
    chatRef: React.RefObject<HTMLDivElement | null>;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
    data: InfiniteData<any, unknown> | undefined;
    member: Member;
    type: "channel" | "conversation";
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
    data,
    member,
    type
}:props) => {
    const [hasInitialized , setHasInitialized] = useState(false);
    
    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if(scrollTop === 0 && shouldLoadMore){
                loadMore();
            }
        };

        topDiv?.addEventListener("scroll",handleScroll);

        return () =>{
            topDiv?.removeEventListener("scroll",handleScroll)
        }
    },[shouldLoadMore , loadMore , chatRef])

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;

        const shouldAutoScroll = () => {
            if(!hasInitialized && bottomDiv){
                setHasInitialized(true)
                return true;
            }

            if(!topDiv)
                return false;
            
            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            
            const isEmpty = data?.pages[0].items.length === 0;

            if((!isEmpty && data?.pages[0].items[0].memberId === member.id && topDiv?.scrollTop !== 0) || (distanceFromBottom <= 300)){
                return true;
            }
        }

        if(shouldAutoScroll()){    
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior:"smooth"
                })
            },1000);
        }
    },[bottomRef , chatRef , count , hasInitialized ,data ])
}