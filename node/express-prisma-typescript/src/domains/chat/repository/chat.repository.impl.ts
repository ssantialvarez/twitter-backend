import { PrismaClient, ReactionType } from '@prisma/client'
import { ChatRepository } from './chat.repository';
import { MessageDTO } from '../dto';
import { UserViewDTO } from '@domains/user/dto';

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


  async getPossibleChats (id: string): Promise<UserViewDTO[]> {
    
    const following = await this.db.follow.findMany({
      where:{
        deletedAt: null,
        followerId: id
      }
    })
    const followingId = following.map((fol) => fol.followedId)

    const users = await this.db.user.findMany({
      where:{
        follows: {some: {followedId: id, deletedAt: null}},
        id: {in: followingId}
      }
    })
    
    return users.map((user) => new UserViewDTO(user))
  }

  async getActiveChats (id: string): Promise<UserViewDTO[]> {
    
    const chats = await this.db.message.findMany({
      where:{
        OR:[
          {senderId: id},
          {receiverId: id}
        ],
        
      },
      select:{
        receiverId: true,
        senderId: true
      }
    })
    const usersId = chats.map((ch) => ch.receiverId).concat(chats.map((ch) => ch.senderId))

    const users = await this.db.user.findMany({
      where:{
        id: {in: usersId, not: id}
      }
    })
    
    return users.map((user) => new UserViewDTO(user))
  }
}
