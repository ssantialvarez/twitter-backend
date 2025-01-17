import { MessageDTO } from "../dto";

export interface ChatRepository {
    create: (senderId: string, receiverId: string ,body: string) => Promise<MessageDTO>
}
