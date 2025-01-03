import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{ params : {serverId: string}}
){
    try {
        const profile = await currentProfile();
        const {name,imageurl} = await req.json();
        if(!profile)
            return new NextResponse("unauthorized",{status:401})

        const {serverId} = await params;

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                name:name,
                imageUrl:imageurl
            }
        });

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID_PATCH" , error);
        return new NextResponse("Internal Error" , {status:500})
    }
}