import { ReactionType } from "@prisma/client"


export class ReactionDTO {
    constructor (reaction: ReactionDTO) {
      this.postId = reaction.postId
      this.userId = reaction.userId
      this.reaction = reaction.reaction
      this.createdAt = reaction.createdAt
    }
  
    postId: string
    userId: string
    reaction: ReactionType
    createdAt: Date
}