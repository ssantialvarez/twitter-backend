import { InternalServerErrorException, NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO, ExtendedUserDTO, UpdateInputDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { FollowerRepository } from '@domains/follower/repository'
import { generateKeyImage, generatePresignedUrl } from '@utils'
import {v4 as uuidv4} from 'uuid';


export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository, private readonly followerRepository: FollowerRepository) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return new UserViewDTO(user)
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // returns only users followed by users the original user follows

    const users = (await this.repository.getRecommendedUsersPaginated(userId, options)).map(user => new UserViewDTO(user))

    return users
  }

  async deleteUser (userId: any): Promise<void> {
    try{
      await this.repository.delete(userId)
    } catch(e) {
      throw new InternalServerErrorException()
    }
  }

  async checkFollow (followerId: string, followedId: string): Promise<Boolean> {
    return await this.followerRepository.isFollowing(followerId, followedId);
  }


  async getUsersByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]>{
    return await this.repository.getByUsername(username,options)
  }

  async updateUser(userId: any, data: UpdateInputDTO) : Promise<{user: ExtendedUserDTO, url: string}> {
    let url = ''
    if(data.profilePicture){
      try{
        data.profilePicture = await generateKeyImage(data.profilePicture)

        url = await generatePresignedUrl({key: data.profilePicture})
      } catch(error){
        throw new InternalServerErrorException()
      }
    }
    const user = await this.repository.update(userId,data)
    return {user, url}
  }
}
