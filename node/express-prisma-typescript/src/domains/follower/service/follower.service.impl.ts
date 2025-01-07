import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import { ConflictException } from '@utils'


export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}
  async followUser (followerId: string, followedId: string): Promise<void> {
    //verify the user wont follow himself
    if(followedId == followerId)
      throw new ConflictException("User cannot follow himself.")
    return this.repository.follow(followerId,followedId);
  }

  async unfollowUser (followerId: string, followedId: string): Promise<void> {
    
    return this.repository.unfollow(followerId,followedId);
  }
}
