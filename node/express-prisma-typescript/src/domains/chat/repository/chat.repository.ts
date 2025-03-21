import { UserViewDTO } from "@domains/user/dto";
import { MessageDTO } from "../dto";

export interface ChatRepository {
    create: (senderId: string, receiverId: string, content: string) => Promise<MessageDTO>
    getChat: (senderId: string, receiverId: string) => Promise<MessageDTO[]>
    getPossibleChats: (id: string) => Promise<UserViewDTO[]>
    getActiveChats: (id: string) => Promise<UserViewDTO[]>
}
