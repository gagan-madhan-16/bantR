"use client"
import {UploadDropzone} from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import { X } from "lucide-react"
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
    
    if(value && fileTpe!="pdf")
    {
        return(
            <div className="relative w-20 h-20 ">
                <Image 
                fill
                src={value}
                alt="uploaded image"
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
    return ( 
        <UploadDropzone 
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
        />
     );
}
