import { ReactionType } from "../dto";


export interface ReactionService {
    insertReaction: (userId: any, postId: any, reaction: ReactionType) => Promise<void>
}
