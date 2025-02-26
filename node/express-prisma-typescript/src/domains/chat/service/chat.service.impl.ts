import { InternalServerErrorException } from "@utils";
import { MessageDTO } from "../dto";
import { ChatRepository } from "../repository";
import { ChatService } from "./chat.service";

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository) {}
  async createMessage (senderId: string, receiverId: string, body: string): Promise<MessageDTO> {
    const message = await this.repository.create(senderId,receiverId,body)
    if(!message) throw new InternalServerErrorException
    return message
  }

  async getChatByUserId (senderId: string, receiverId: string): Promise<MessageDTO[]> {
    return await this.repository.getChat(senderId,receiverId)
  }
}
