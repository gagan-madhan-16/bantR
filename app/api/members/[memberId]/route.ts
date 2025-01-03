import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req:Request,
    {params}:{params:{memberId:string}}
)
{
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId")
        const memberId = searchParams.get("memberId")

        if(!profile)
            return new NextResponse("Unauthorized",{status:401})

        if(!serverId)
            return new NextResponse("Server Id missing",{status:400})

        if(!memberId)
            return new NextResponse("Member Id missing",{status:400})

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id,
            },
            data:{
                members:{
                    update: {
                        where:{
                            id:memberId,
                            profileId:{
                                not: profile.id
                            }
                        },
                        data:{
                            role:role
                        }
                    }
                }
            },
            include:{
                members: {
                    include : {
                        profile : true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });


        return NextResponse.json(server);

    } catch (error) {
        console.log("{MEMBER_ID Patch" , error);
        
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{memberId:string}}
)
{
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId")
        const memberId = searchParams.get("memberId")

        if(!profile)
            return new NextResponse("Unauthorized",{status:401})

        if(!serverId)
            return new NextResponse("Server Id missing",{status:400})

        if(!memberId)
            return new NextResponse("Member Id missing",{status:400})

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id,
            },
            data:{
                members:{
                    deleteMany: {
                        id:memberId,
                        profileId:{
                            not: profile.id
                        }
                    }
                }
            },
            include:{
                members: {
                    include : {
                        profile : true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });


        return NextResponse.json(server);

    } catch (error) {
        console.log("{MEMBER_ID Delete" , error);
        
        return new NextResponse("Internal Error",{status:500});
    }
}