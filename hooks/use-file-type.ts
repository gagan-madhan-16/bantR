"use client"

import axios from 'axios';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { useEffect, useState } from 'react';

interface props{
    fileUrl:string
}

export function useFileType({
    fileUrl
}:props){
    try {
        const [fileType , setFileType] = useState("unknown")

        useEffect(() => {
            axios.get(fileUrl, { responseType: 'arraybuffer' })
                .then(response => {
                    const buffer = Buffer.from(response.data);
                    return fileTypeFromBuffer(buffer);
                })
                .then(result => {
                    if (result && result.mime) {
                        setFileType(result.mime.split('/')[0]);                   
                    } else {
                        console.warn("File type detection failed. Setting default type.");
                        setFileType("unknown"); 
                    }
                })
                .catch(error => {
                    console.error("Error fetching or processing file:", error);
                });
        }, [fileUrl]);

        return fileType;
    } catch (error) {
        console.error('Error fetching or identifying the file:', error);
        return "unknown";
    }
}
