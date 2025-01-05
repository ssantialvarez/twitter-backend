import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { FollowDTO } from '../dto'
import { FollowerRepository } from './follower.repository'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  async follow (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.create({
      data: {
        followerId: followerId,
        followedId: followedId
      }
    })
    return ;
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    /*
    await this.db.follow.delete({
      where: {
        followerId: followerId,
        followedId: followedId
      }
    })
    */
  }
  
}
