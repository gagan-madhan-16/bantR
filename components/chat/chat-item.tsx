import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tooltip";
import { Edit,  FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";

import { useFileType } from "@/hooks/use-file-type";
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form"
import * as z from "zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter , useParams } from "next/navigation";
import { SpinnerCircularFixed } from 'spinners-react';



interface props {
    id:string;
    content: string;
    member: Member & {
        profile: Profile;
    }
    timeStamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string,string>
    type: "channel" | "conversation"
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN":<ShieldAlert className="h-4 w-4 text-rose-500" />
}

const formSchema = z.object({
    content : z.string().min(1)
});

export const ChatItem = ({
    id,
    content,
    member,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketQuery,
    socketUrl,
    type
}:props) => {
    const [isEditing , setIsEditing] = useState(false);
    const [ready , setReady] = useState(true);

    const {onOpen , data} = useModal();
    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if(member.id === currentMember.id)
            return;

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect (() => {
        const handleKeyDown = (event:any) => {
            if(event.key === "Escape" || event.keyCode === 27)
                setIsEditing(false);
        }

        window.addEventListener("keydown" , handleKeyDown);

        return () => window.removeEventListener("keydown" , handleKeyDown); 
    },[])

    let fileType = null;

    fileType = fileUrl !== null ? useFileType({fileUrl}):null;

    useEffect(() => {
        setReady(fileType === null);
    },[fileType,fileUrl]);

       
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const channelDeleteCondition = member.role === MemberRole.GUEST ? isAdmin || isModerator || isOwner : member.role === MemberRole.MODERATOR ? isAdmin || isOwner : isOwner;
    const canDeleteMessage = type === "channel" ? !deleted && channelDeleteCondition : !deleted && isOwner;
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === "application" && fileUrl;
    const isImage = fileType === "image" && fileUrl;
    const isAudio = fileType === "audio" && fileUrl;
    const isVideo = fileType === "video" && fileUrl;
    // const neither = fileType === "unknown" && fileUrl;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });

            await axios.patch(url , values);

            setIsEditing(false);
            form.reset();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        form.reset({
            content:content
        });
    },[content])

    return (
        <div
        className="relative group flex items-center hover:bg-black/5 p-4 transition w-full"
        >
            <div
            className="group flex gap-2 items-start w-full"
            >
                <div
                className="cursor-pointer hover:drop-shadow-md transition"
                onClick={onMemberClick}
                >
                    <UserAvatar 
                    src={member.profile.imageUrl}
                    />
                </div>
                <div
                className="flex flex-col w-full"
                >
                    <div
                    className="flex items-center gap-x-2"
                    >
                        <div
                        className="flex items-center"
                        >
                            <p
                            className="font-semibold text-sm hover:underline cursor-pointer"
                            onClick={onMemberClick}
                            >
                                {member.profile.name}
                            </p>
                            <ActionToolTip 
                            label={member.role}
                            >
                                {roleIconMap[member.role]}
                            </ActionToolTip>
                        </div>
                        <span
                        className="text-xs text-zinc-500 dark:text-zinc-400"
                        >
                            {timeStamp}
                        </span>
                    </div>
                    {fileUrl && (
                        <SpinnerCircularFixed
                        enabled={fileType !== "application" && fileType !== "image" && fileType !== "audio" && fileType !== "video"}
                        size={40} thickness={119} speed={100} color="rgba(64, 57, 172, 1)" secondaryColor="rgba(0, 0, 0, 0.44)"
                        />
                    )}
                    {isImage && (
                        <a 
                        href={fileUrl}
                        target="_blank"
                        rel="noopner norefer"
                        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image 
                            src={fileUrl}
                            alt={content}
                            fill
                            className="object-cover"
                            />
                        </a>
                    )}
                    {(isPdf ) && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 w-40">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
                            >
                                File
                            </a>
                        </div>
                    )}
                    {
                        isAudio && (
                            <a
                            className="relative aspect-square rounded-[21px] mt-2 overflow-hidden border flex items-center bg-secondary h-10 w-80"
                            >
                            <audio 
                            className="absolute inset-0 h-full w-full object-cover" 
                            controls
                            >
                                <source src={fileUrl} type="audio/mpeg" />
                                Your browser does not support the audio tag.
                            </audio>
                            </a>
                        )
                    }
                    {isVideo && (
                        <a
                        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-60 w-60"
                        >
                        <video 
                        className="absolute inset-0 h-full w-full object-cover" 
                        controls
                        >
                            <source src={fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        </a>
                    )}
                    {!fileUrl  && !isEditing && (
                        <p
                        className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-ainc-500 dark:text-zinc-400 text-xs mt-1"
                        )}
                        >
                          {content}
                          {isUpdated && !deleted && (
                            <span
                            className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400"
                            >
                                (edited)
                            </span>
                          )}  
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form
                        {...form}
                        >
                            <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex items-center w-full gap-x-2 pt-2"
                            >
                                <FormField 
                                control={form.control}
                                name="content"
                                render={({field}) => (
                                    <FormItem
                                    className="flex-1"
                                    >
                                        <FormControl>
                                            <div
                                            className="relative w-full"
                                            >
                                                <Input 
                                                className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                disabled={isLoading}
                                                placeholder="Edited Message"
                                                {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button
                                size="sm"
                                variant="primary"
                                disabled={isLoading}
                                >
                                    Save
                                </Button>
                            </form>
                            <span
                            className="text-[10px] mt-1 text-zinc-400"
                            >
                                Press escape to cancel , enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div
                className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm"
                >
                    {canEditMessage && (
                        <ActionToolTip
                        label="Edit"
                        >
                            <Edit
                            onClick={() => setIsEditing(true)} 
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionToolTip>
                    )}
                    <ActionToolTip
                        label="Delete"
                    >
                        <Trash  
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen("deleteMessage" , {
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery
                        })}
                        />
                    </ActionToolTip>
                </div>
            )}
        </div>
    )
}