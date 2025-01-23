import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";


export interface ReactionService {
    insertReaction: (userId: any, postId: any, reaction: ReactionType) => Promise<ReactionDTO>
    deleteReaction: (userId: any, postId: any, reaction: ReactionType) => Promise<void>
    getReactionByUserId: (userId: any, reaction: ReactionType) => Promise<ReactionDTO[]>
}
