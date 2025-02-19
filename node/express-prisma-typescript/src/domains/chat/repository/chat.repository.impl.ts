import { PrismaClient, ReactionType } from '@prisma/client'
import { ChatRepository } from './chat.repository';
import { MessageDTO } from '../dto';

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {}
  async create (senderId: string, receiverId: string, content: string): Promise<MessageDTO> {
    
    const message = await this.db.message.create({
      data: {
        senderId,
        receiverId,
        content
      }
    })
    return new MessageDTO(message)
  }

  async getChat (senderId: string, receiverId: string): Promise<MessageDTO[]> {
    
    const messages = await this.db.message.findMany({
      where:{
        OR:[{receiverId: senderId, senderId: receiverId},
          {receiverId: receiverId, senderId: senderId},
        ]
      }
    })
    
    return messages.map((mess) => new MessageDTO(mess))
  }
}
