import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './follower.repository'
import { FollowDTO } from '../dto'
import { UserViewDTO } from '@domains/user/dto'


export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  async follow (followerId: string, followedId: string): Promise<FollowDTO> {
    return await this.db.follow.upsert({
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
      }
    }).then(follow => new FollowDTO(follow))
  }

  async unfollow (followerId: string, followedId: string): Promise<FollowDTO[]> {
    
    const result =  await this.db.follow.updateManyAndReturn({
      where : {
        followedId,
        followerId,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    })
    return result.map(res => new FollowDTO(res))
  }

  async getFollowers (followedId: string): Promise<UserViewDTO[]> {
    
    
    const users = await this.db.follow.findMany({
      select:{
        follower:true
      },
      where : {
        AND: [
          {
            followedId,
            deletedAt: null
          }
        ]
      }
    })
    return users.map(user => new UserViewDTO(user.follower))
  }

  async getFollowed (followerId: string): Promise<UserViewDTO[]> {
    
    
    const users = await this.db.follow.findMany({
      select:{
        followed:true
      },
      where : {
        AND: [
          {
            followerId,
            deletedAt: null
          }
        ]
      }
    })
    return users.map(user => new UserViewDTO(user.followed))
  }

  async getFollowing (followerId: string, followedId: string): Promise<Boolean>{

    const result = await this.db.follow.findFirst({
      where: {
        followedId: followedId,
        followerId: followerId,
        deletedAt: null
      }
    }) 
    
    return result != null
  }
  
}
