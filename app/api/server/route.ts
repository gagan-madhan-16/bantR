import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { log } from "console";
import { NextResponse } from "next/server";
import { v4 as uuiv4} from "uuid"

export async function POST(req:Request){
    try {
        const {name,imageUrl} = await req.json();
        const profile = await currentProfile();

        if(!profile)
            return new NextResponse("Unauthorized",{status:401})

        const server = await db.server.create({
            data:{
                name:name,
                profileId:profile.id,
                imageUrl:imageUrl,
                inviteCode:uuiv4(),
                channels:{
                    create:[
                        {
                            name:"general",
                            profileId:profile.id
                        }
                    ]
                },
                members: {
                    create:[
                        {
                            profileId:profile.id,
                            role:MemberRole.ADMIN
                        }
                    ]
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        log("API/SERVER_POST");
        log(error);
        return new NextResponse("Internal Error",{status:500});
    }
}