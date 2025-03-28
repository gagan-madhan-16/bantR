"use client"

import { useState } from "react";
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
    const {isOpen, onClose ,type , data , onOpen} = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const {server} = data;

    const [copied , setCopied] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        },2000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite" , {server:response.data});

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    if(!isModalOpen)
        return null;

    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input 
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value={inviteUrl}
                        />
                        <Button size="icon" onClick={onCopy} disabled={isLoading}>
                            {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                        </Button>
                    </div>
                    <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-zinc-500 mt-4"
                    disabled={isLoading}
                    onClick={onNew}
                    >
                        Generate a new Link
                        <RefreshCw 
                        className="h-4 w-4 ml-2"
                        />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
     );
}