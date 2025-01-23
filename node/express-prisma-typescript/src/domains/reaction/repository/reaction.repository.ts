import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";

export interface ReactionRepository {
    insert: (userId: string, postId: string, reaction: ReactionType) => Promise<ReactionDTO>
    delete: (userId: string, postId: string, reaction: ReactionType) => Promise<void>
    getReactionByUserId: (userId: string, reaction: ReactionType) => Promise<ReactionDTO[]> 
}
