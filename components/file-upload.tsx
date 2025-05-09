"use client"
import {UploadDropzone} from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { FileIcon, X } from "lucide-react"
import Image from "next/image"

interface props {
    onChange: (url?: string) => void;
    value: string
    endpoint: "serverImage" | "messageFile"
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}:props) => {
    const fileTpe = value?.split(".").pop();
    
    if(value &&  endpoint === "serverImage")
    {
        return(
            <div className="relative w-20 h-20 ">
                <Image 
                fill
                src={value}
                alt= "uploaded image"
                className="rounded-full"
                />
                <button 
                    onClick={() =>{
                        onChange("")
                    }}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }

    if(value &&  endpoint === "messageFile")
        {
            return(
                <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
                    >
                        {value}
                    </a>
                    <button 
                        onClick={() =>{
                            onChange("")
                        }}
                        className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                        type="button"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>
            )
        }

    return ( 
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
        />
     );
}
