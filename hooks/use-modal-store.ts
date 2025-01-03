import { Server } from "@prisma/client";
import {create} from "zustand"

export type ModalType = "createServer" | "invite" | "editServer" | "members";

interface ModalData {
    server?: Server
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data:ModalData) => void;
    onClose: () => void;
    data: ModalData
};

export const useModal = create<ModalStore>((set) => ({
    type:null,
    isOpen:false,
    onOpen: (type,data={}) => set({isOpen:true, type:type , data:data}),
    onClose: () => set({type:null,isOpen:false}),
    data:{}
}));