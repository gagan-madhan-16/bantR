import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params}:{ params : {channelId: string}}
){
    try {
        const profile = await currentProfile();
        
        if(!profile)
            return new NextResponse("unauthorized",{status:401})
        
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId")

        if(!serverId)
            return new NextResponse("Server Id missing",{status:400})

        const {channelId} = await params;

        if(!channelId)
            return new NextResponse("Channel Id missing",{status:400})

        const server = await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in : [MemberRole.MODERATOR , MemberRole.ADMIN]
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id:channelId,
                        name:{
                            not: "general",
                        }
                    }
                }
            }
        });

        return NextResponse.json(server)
    } catch (error) {
        console.log("CHANNEL_ID_DELETE" , error);
        return new NextResponse("Internal Error" , {status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{ params : {channelId: string}}
){
    try {
        const profile = await currentProfile();
        
        if(!profile)
            return new NextResponse("unauthorized",{status:401})
        
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId")

        if(!serverId)
            return new NextResponse("Server Id missing",{status:400})

        const {channelId} = await params;

        
        if(!channelId)
            return new NextResponse("Channel Id missing",{status:400})

        
        const {name,type} = await req.json();

        if(name === "general")
            return new NextResponse("name can not be 'general'",{status:400})


        const server = await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in : [MemberRole.MODERATOR , MemberRole.ADMIN]
                        }
                    }
                }
            },
            data:{
                channels:{
                    update:{
                        where:{
                            id:channelId,
                            NOT:{
                                name:"general"
                            }
                        },
                        data:{
                            name:name,
                            type:type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server)
    } catch (error) {
        console.log("CHANNEL_ID_UPDATE" , error);
        return new NextResponse("Internal Error" , {status:500})
    }
}