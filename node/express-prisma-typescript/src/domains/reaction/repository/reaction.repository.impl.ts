import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository';
//import { ReactionType } from '../dto';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}
  async insert(userId: string, postId: string, reaction: ReactionType): Promise<void>{
    try{
      await this.db.reaction.create({
        data:{
          userId: userId,
          postId: postId,
          reaction: reaction
        }
      })
    }catch(e){

    }
    
  }
  async delete(userId: string, postId: string, reaction: ReactionType): Promise<void>{
    try{
      await this.db.reaction.delete({
        where:{
          userId_postId_reaction:{
            userId,
            postId,
            reaction

          }
        }
      })
    }catch(e){

    }

  }
}
