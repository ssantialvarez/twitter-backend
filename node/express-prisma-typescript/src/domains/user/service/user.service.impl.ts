import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserViewDTO, ExtendedUserDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { FollowerRepository } from '@domains/follower/repository'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository, private readonly followerRepository: FollowerRepository) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return new UserViewDTO(user)
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows

    const users = (await this.repository.getRecommendedUsersPaginated(options)).map(user => new UserViewDTO(user))

    return users
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async checkFollow (followerId: string, followedId: string): Promise<Boolean> {
    

    return await this.followerRepository.isFollowing(followerId, followedId);
  }


  async getUsersByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]>{
    

    return await this.repository.getByUsername(username,options)
  }

  async updateUser(userId: any, data: ExtendedUserDTO) : Promise<UserViewDTO> {

    return await this.repository.update(userId,data)
  }
}
