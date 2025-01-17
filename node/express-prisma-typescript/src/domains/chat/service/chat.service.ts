import { MessageDTO } from "../dto";


export interface ChatService {
    createMessage: (senderId: string, receiverId: string ,body: string) => Promise<MessageDTO>
}
