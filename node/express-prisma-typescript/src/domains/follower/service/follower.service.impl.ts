import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import { ConflictException, NotFoundException } from '@utils'
import { UserViewDTO } from '@domains/user/dto';
import { FollowDTO } from '../dto';


export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}
  async followUser (followerId: string, followedId: string): Promise<FollowDTO> {    
    if(followedId == followerId)
      throw new ConflictException("User cannot follow himself.")
    return this.repository.follow(followerId,followedId);
  }

  async unfollowUser (followerId: string, followedId: string): Promise<FollowDTO> {
    const result = await this.repository.unfollow(followerId,followedId)
      if(result.length == 0) throw new NotFoundException('follow')
        
    return result.pop() as FollowDTO
  }

  async isFollowing (followerId: string, followedId: string): Promise<Boolean> {
    
    return this.repository.getFollowing(followerId,followedId);
  }

  async getFollowersById (followedId: string): Promise<UserViewDTO[]> {
    
    return this.repository.getFollowers(followedId);
  }

  async getFollowedById (followerId: string): Promise<UserViewDTO[]> {
    
    return this.repository.getFollowed(followerId);
  }
}
