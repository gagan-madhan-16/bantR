import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";


import { getOrCreateCoversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from 'next/navigation';

interface props {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean
        audio?: boolean
    }
}

const MemberIdPage = async ({
    params,
    searchParams
}:props) => {

    const profile = await currentProfile();
    const {redirectToSignIn} = await auth()

    if(!profile)
        return redirectToSignIn();
    

    const currentMember = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        },
        include:{
            profile: true
        }
    })

    if(!currentMember)
        return redirect("/");

    const conversation = await getOrCreateCoversation(currentMember.id , params.memberId);

    if(!conversation)
        return redirect(`/servers/${params.serverId}`);

    if(searchParams.audio && searchParams.video)
        notFound();

    const {memberOne , memberTwo} = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne ;

    return ( 
        <div
        className="bg-white dark:bg-[#313338] flex flex-col h-full"
        >
            <ChatHeader 
            imageurl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
            />
            {!searchParams.video && !searchParams.audio && (
                <>
                    <ChatMessages 
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                        paramKey="conversationId"
                        paramValue={conversation.id}
                    />
                    <ChatInput 
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}
            {searchParams.video && !searchParams.audio && (
                <MediaRoom 
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {searchParams.audio && !searchParams.video && (
                <MediaRoom 
                    chatId={conversation.id}
                    video={false}
                    audio={true}
                />
            )}
        </div>
     );
}
 
export default MemberIdPage;