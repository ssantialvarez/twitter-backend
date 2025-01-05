import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import { ForbiddenException, NotFoundException } from '@utils'


export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}
  async followUser (followerId: string, followedId: string): Promise<void> {
    console.log(followedId)
    console.log(followerId)
    return this.repository.follow(followerId,followedId);
  }

  async unfollowUser (followerId: string, followedId: string): Promise<void> {
    return this.repository.unfollow(followerId,followedId);
  }
}
