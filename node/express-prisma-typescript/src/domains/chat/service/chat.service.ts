import { UserViewDTO } from "@domains/user/dto";
import { MessageDTO } from "../dto";


export interface ChatService {
    createMessage: (senderId: string, receiverId: string, content: string) => Promise<MessageDTO>
    
    getChatByUserId: (senderId: string, receiverId: string) => Promise<MessageDTO[]>
    getPossibleChats: (id: string) => Promise<UserViewDTO[]>
    getActiveChats: (id: string) => Promise<UserViewDTO[]>
}
