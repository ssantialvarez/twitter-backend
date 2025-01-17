import { PrismaClient, ReactionType } from '@prisma/client'
import { ChatRepository } from './chat.repository';
import { MessageDTO } from '../dto';
import {v4 as uuidv4} from 'uuid';

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {}
  async create (senderId: string, receiverId: string ,body: string): Promise<MessageDTO> {
    const roomId = await this.db.message.findFirst({
      select:{
        roomId: true
      },
      where:{
        receiverId,
        senderId
      }
    })
    const message = await this.db.message.create({
      data: {
        content: body,
        roomId: roomId?.roomId ?? uuidv4(),
        senderId,
        receiverId
      }
    })
    return new MessageDTO(message)
  }
}
