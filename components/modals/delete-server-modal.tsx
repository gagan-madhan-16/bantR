"use client"

import { useState } from "react";
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";


export const DeleteServerModal = () => {
    const {isOpen, onClose ,type , data , onOpen} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteServer";
    const {server} = data;

    const [isLoading , setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);            
        } finally {
            setIsLoading(false)
        }
    }

    if(!isModalOpen)
        return null;

    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-500 text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Are you sure you want to delete <span className="font-semibold text-teal-500" >{server?.name}</span>?<br />It will be prmanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter 
                className="bg-zinc-500 px-6 py-4"
                >
                    <div
                    className="flex items-center justify-between w-full"
                    >
                        <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="outline"
                        className="border-teal-700 bg-transparent text-teal-300 hover:bg-teal-800/30 hover:text-teal-100 transition-all"
                        >
                        Cancel
                        </Button>

                        <Button
                        disabled={isLoading}
                        onClick={onClick}
                        className="bg-red-600 text-white hover:bg-red-700 transition-all"
                        >
                        Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}