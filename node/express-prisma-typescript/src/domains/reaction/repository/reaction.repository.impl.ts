import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository';
//import { ReactionType } from '../dto';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}
  async insert(userId: string, postId: string, reaction: ReactionType): Promise<void>{
    
    await this.db.reaction.create({
      data:{
        userId: userId,
        postId: postId,
        reaction: reaction
      }
    })
  }  
}
