import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle";

import { NavigationItem } from "@/components/modals/navigation/navigation-item";
import {NavigationAction} from "@/components/modals/navigation/navigation-action";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if(!profile)
        return redirect("/")

    const servers = await db.server.findMany({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })

    return ( 
        <div
        className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]  bg-emerald-200 py-3"
        >
            <NavigationAction />
            <Separator 
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => {
                    return(
                    <div key={server.id}>
                        <NavigationItem 
                         name={server.name}
                         id={server.id}
                         imageUrl={server.imageUrl}
                        />
                    </div>
                )})}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements:{
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
     );
}