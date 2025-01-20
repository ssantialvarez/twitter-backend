import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import { ConflictException } from '@utils'
import { UserViewDTO } from '@domains/user/dto';


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

  async isFollowing (followerId: string, followedId: string): Promise<Boolean> {
    
    return this.repository.isFollowing(followerId,followedId);
  }

  async getFollowersById (followedId: string): Promise<UserViewDTO[]> {
    
    return this.repository.getFollowers(followedId);
  }

  async getFollowedById (followerId: string): Promise<UserViewDTO[]> {
    
    return this.repository.getFollowed(followerId);
  }
}
