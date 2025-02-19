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

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<{users: UserViewDTO[], info: {limit: Number, nextSkip: Number | undefined}}> {
    // returns only users followed by users the original user follows
    options.limit = options.limit && !Number.isNaN(options.limit) ? options.limit + 1 : 51;

    const users = (await this.repository.getRecommendedUsersPaginated(userId, options)).map(user => new UserViewDTO(user))

    options.limit -= 1
    if(users.length == options.limit + 1){
      options.skip = options.skip ? options.skip + options.limit : options.limit
      users.pop()
    }else{
      options.skip = undefined
    }
    
    return {info:{limit: options.limit, nextSkip: options.skip}, users: users}
  }

  async deleteUser (userId: any): Promise<void> {
    try{
      await this.repository.delete(userId)
    } catch(e) {
      throw new InternalServerErrorException()
    }
  }

  async checkFollow (followerId: string, followedId: string): Promise<Boolean> {
    return await this.followerRepository.getFollowing(followerId, followedId);
  }


  async getUsersByUsername (username: string, options: OffsetPagination): Promise<{users: UserViewDTO[], info: {limit: Number, nextSkip: Number | undefined}}>{
    options.limit = options.limit && !Number.isNaN(options.limit) ? options.limit + 1 : 51;

    const users = await this.repository.getByUsername(username,options); 

    options.limit -= 1
    if(users.length == options.limit + 1){
      options.skip = options.skip ? options.skip + options.limit : options.limit
      users.pop()
    }else{
      options.skip = undefined
    }

    return {info:{limit: options.limit, nextSkip: options.skip}, users: users}
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
