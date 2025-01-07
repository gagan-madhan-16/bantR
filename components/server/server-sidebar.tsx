import { redirect } from 'next/navigation';
import { ChannelType, MemberRole } from '@prisma/client';

import { db } from '@/lib/db';
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from '@/components/ui/scroll-area';

import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface props{
    serverId:string
}

const iconMap = {
    [ChannelType.TEXT] : <Hash className='mr-2 h-4 w-4'/>,
    [ChannelType.AUDIO] : <Mic className='mr-2 h-4 w-4'/>,
    [ChannelType.VEDIO] : <Video className='mr-2 h-4 w-4'/>,
}

const roleIconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.MODERATOR] : <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
    [MemberRole.ADMIN] : <ShieldAlert className='h-4 w-4 mr-2 text-rose-500'/>,

}

export const ServerSidebar = async({
    serverId
}:props) => {

    const profile = await currentProfile();

    if(!profile)
        return redirect('/');

    const server = await db.server.findUnique({
        where:{
            id:serverId
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            members: {
                include: {
                    profile:true
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    });

    const textChannel = server?.channels.filter((channel) => {
        return channel.type === ChannelType.TEXT;
    });
    
    const audioChannel = server?.channels.filter((channel) => {
        return channel.type === ChannelType.AUDIO;
    });
    
    const videoChannel = server?.channels.filter((channel) => {
        return channel.type === ChannelType.VEDIO;
    });
    
    const members = server?.members.filter((member) => {
        return member.profileId !== profile.id;
    });
    

    if(!server) {
        return redirect('/')
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role


    return(
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-emerald-500'>
            <ServerHeader 
            server={server}
            role={role}
            />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    <ServerSearch 
                    data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannel?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannel?.map((channel) => ({
                                id:channel.id,
                                name:channel.name,
                                icon:iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannel?.map((channel) => ({
                                id:channel.id,
                                name:channel.name,
                                icon:iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Memebers",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        }
                    ]}
                    />
                </div>
            </ScrollArea>
        </div>
    )
}