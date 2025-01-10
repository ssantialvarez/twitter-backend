import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { ForbiddenException } from "@utils";

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}
  

  async insertReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{
    if(ReactionType.LIKE == reaction || ReactionType.RETWEET == reaction)
      await this.repository.insert(userId,postId,reaction)
    else
      throw new ForbiddenException()
    
  }

  async deleteReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{
    
    await this.repository.delete(userId,postId,reaction)
  }
  
}
