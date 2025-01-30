export class FollowDTO {
    constructor (follow: FollowDTO) {
      this.followerId = follow.followerId
      this.followedId = follow.followedId
      this.createdAt = follow.createdAt
      this.deletedAt = follow.deletedAt
    }
  
    followerId: string
    followedId: string
    createdAt: Date
    deletedAt?: Date | null
}