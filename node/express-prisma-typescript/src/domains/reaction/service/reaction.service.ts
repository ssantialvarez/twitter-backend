import { ReactionType } from "@prisma/client";


export interface ReactionService {
    insertReaction: (userId: any, postId: any, reaction: ReactionType) => Promise<void>
    deleteReaction: (userId: any, postId: any, reaction: ReactionType) => Promise<void>
}
