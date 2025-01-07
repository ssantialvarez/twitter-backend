import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  
}
