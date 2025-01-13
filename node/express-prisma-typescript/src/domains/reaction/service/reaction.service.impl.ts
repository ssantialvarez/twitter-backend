import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { ForbiddenException } from "@utils";
import { ReactionDTO } from "../dto";

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}
  

  async insertReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{
    if(ReactionType.LIKE == reaction || ReactionType.RETWEET == reaction)
      await this.repository.insert(userId,postId,reaction)
    else
      throw new ForbiddenException()
    
  }

  async getReactionByUserId (userId: any, reaction: ReactionType): Promise<ReactionDTO[]>{
    return await this.repository.getReactionByUserId(userId,reaction)
  }

  async deleteReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{
    
    await this.repository.delete(userId,postId,reaction)
  }
  
}
