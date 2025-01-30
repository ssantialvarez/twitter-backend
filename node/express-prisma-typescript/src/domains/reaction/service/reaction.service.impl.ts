import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@utils";
import { ReactionDTO } from "../dto";

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}
  
  async insertReaction (userId: any, postId: any, reaction: ReactionType): Promise<ReactionDTO>{
    if(ReactionType.LIKE != reaction && ReactionType.RETWEET != reaction)
      throw new BadRequestException()

    try{
      return await this.repository.insert(userId,postId,reaction)
    }catch(e){
      throw new InternalServerErrorException()
    }
    
  }

  async getReactionByUserId (userId: any, reaction: ReactionType): Promise<ReactionDTO[]>{
    if(ReactionType.LIKE != reaction && ReactionType.RETWEET != reaction)
      throw new BadRequestException()
    return await this.repository.getReactionByUserId(userId,reaction)
  }

  async deleteReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{
    try{
      await this.repository.delete(userId,postId,reaction)
    }catch(e){
      throw new NotFoundException('reaction')
    }
    
  }
}
