import { ReactionType } from "../dto";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}
  

  async insertReaction (userId: any, postId: any, reaction: ReactionType): Promise<void>{

    await this.repository.insert(userId,postId,reaction)
    
  }
  
}
