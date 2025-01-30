import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository';
import { ReactionDTO } from '../dto';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}
  async insert(userId: string, postId: string, reaction: ReactionType): Promise<ReactionDTO>{
    return await this.db.reaction.create({
      data:{
        userId: userId,
        postId: postId,
        reaction: reaction
      }
    }).then(reaction => new ReactionDTO(reaction))
    
  }

  async getReactionByUserId(userId: string, reaction: ReactionType): Promise<ReactionDTO[]>{
    const reactions = await this.db.reaction.findMany({
      where:{
        userId,
        reaction
      }
    })
    
    return reactions.map(aux => new ReactionDTO(aux))
  }

  async delete(userId: string, postId: string, reaction: ReactionType): Promise<void>{    
    await this.db.reaction.delete({
      where:{
        userId_postId_reaction:{
          userId,
          postId,
          reaction
        }
      }
    })
  }
}
