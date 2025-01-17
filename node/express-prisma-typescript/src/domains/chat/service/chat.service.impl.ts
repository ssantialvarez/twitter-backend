
import { MessageDTO } from "../dto";
import { ChatRepository } from "../repository";
import { ChatService } from "./chat.service";

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository) {}
  async createMessage (senderId: string, receiverId: string, data: string): Promise<MessageDTO> {
    

    return await this.repository.create(senderId,receiverId,data)
  }
}
