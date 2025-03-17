import { InternalServerErrorException, NotFoundException } from "@utils";
import { MessageDTO } from "../dto";
import { ChatRepository } from "../repository";
import { ChatService } from "./chat.service";
import { UserViewDTO } from "@domains/user/dto";

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository) {}
  async createMessage (senderId: string, receiverId: string, body: string): Promise<MessageDTO> {
    const message = await this.repository.create(senderId,receiverId,body)
    if(!message) throw new InternalServerErrorException
    return message
  }

  async getChatByUserId (senderId: string, receiverId: string): Promise<MessageDTO[]> {
    try{
      return await this.repository.getChat(senderId,receiverId)
    }catch(e){
      throw new NotFoundException('chat')
    }
  }

  async getPossibleChats (id: string): Promise<UserViewDTO[]> {
    try{
      return await this.repository.getPossibleChats(id)
    }catch(e){
      throw new NotFoundException('chat')
    }
    
  }

  async getActiveChats (id: string): Promise<UserViewDTO[]> {
    try{
      return await this.repository.getActiveChats(id)
    }catch(e){
      throw new NotFoundException('chat')
    }
  }
}
