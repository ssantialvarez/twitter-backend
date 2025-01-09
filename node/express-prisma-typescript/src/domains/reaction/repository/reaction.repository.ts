import { ReactionType } from "@prisma/client";

export interface ReactionRepository {
    insert: (userId: string, postId: string, reaction: ReactionType)=> Promise<void>
}
