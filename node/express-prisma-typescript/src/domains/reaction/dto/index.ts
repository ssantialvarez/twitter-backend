

export class ReactionDTO {
    constructor (reaction: ReactionDTO) {
      this.postId = reaction.postId
      this.userId = reaction.userId
      this.reactionType = reaction.reactionType
      this.createdAt = reaction.createdAt
    }
  
    postId: string
    userId: string
    reactionType: ReactionType
    createdAt: Date
}


export enum ReactionType {
    Like = "LIKE",
    Retweet = "RETWEET"
}