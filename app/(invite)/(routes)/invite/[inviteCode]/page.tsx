import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

interface props{
    params: {
        inviteCode:string;
    }
}

const InviteCodePage = async ({params}:props) => {
    
    const profile = await currentProfile();
    const {redirectToSignIn} = await auth()

    if(!profile)
        return redirectToSignIn();

    if(!params.inviteCode)
        return redirect('/')

    const existInServer = await db.server.findFirst({
        where: {
            inviteCode:params.inviteCode,
            members: {
                some: {
                    profileId : profile.id
                }
            }
        }
    });

    if(existInServer)
        return redirect(`/servers/${existInServer.id}`)

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data:{
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });

    if(server)
        return redirect(`/servers/${server.id}`)
    
    return (null);
}
 
export default InviteCodePage;