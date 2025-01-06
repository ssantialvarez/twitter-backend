import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './follower.repository'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  async follow (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.upsert({
      where: {
        followedId_followerId: {
          followedId,
          followerId
        }
      },
      update: {
        deletedAt: null
      },
      create: {
        followedId: followedId,
        followerId: followerId
      },

    })
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    const data = { followedId: followedId, followerId: followerId }
    
    
    await this.db.follow.update({
      where : {
        followedId_followerId: data
      },
      data: {
        deletedAt: new Date()
      }
    })
    
  }
  
}
