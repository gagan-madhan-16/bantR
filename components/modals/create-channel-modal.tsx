"use client"

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ChannelType } from "@prisma/client";
import qs from "query-string"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
    FormMessage
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {FileUpload} from "@/components/file-upload"
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";


export const CreateChannelModal = () => {
    
    const router = useRouter();
    const {isOpen, onClose ,type , data} = useModal();
    const {server , channelType} = data;
    
    const isModalOpen = isOpen && type === "createChannel";

    
    const formSchema = z.object({
        name: z.string().min(1,{
            message: "Channel name is required"
        }).refine(
            name => name!== "general",
            {
                message: "Channel Name can not be 'general'"
            }
        ),
        type: z.nativeEnum(ChannelType)
    })
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT
        }
    })
    
    useEffect(() => {
        if(channelType){
            form.setValue("type" , channelType)
        }
        else{
            form.setValue("type" , ChannelType.TEXT)
        }
    },[channelType,form])

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>){
        try {
            const url = qs.stringifyUrl({
                url:"/api/channels",
                query: {
                    serverId:server?.id
                }

            })
            await axios.post(url,values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () =>{
        form.reset();
        onClose();
    }

    if(!isModalOpen)
        return null;

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            
                            <FormField 
                                control={form.control} 
                                name="name"
                                render={({field}) => {
                                    return (
                                    <FormItem>
                                        <FormLabel  className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter Channel Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}} />
                            <FormField 
                                control={form.control}
                                name="type"
                                render = {({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Channel Type
                                        </FormLabel>
                                        <Select 
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger
                                            className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Select a Channel Type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary" className="items-center">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}