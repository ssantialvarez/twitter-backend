import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserViewDTO, ExtendedUserDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { FollowerRepository } from '@domains/follower/repository'
import { generatePresignedUrl } from '@utils'
import {v4 as uuidv4} from 'uuid';


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

  async updateUser(userId: any, data: ExtendedUserDTO) : Promise<{user: ExtendedUserDTO, url: string}> {
    let url = ''
    if(data.profilePicture){
      try{
        let image = data.profilePicture
        let arr = image.split('.')
        let imageName = arr.at(0) as string
        imageName = imageName.concat("__"+uuidv4())
        image = imageName.concat('.'+arr.at(1))
        data.profilePicture = image

        url = await generatePresignedUrl({key: image})
      } catch(error){
        console.log(error)
      }
    }
    const user = await this.repository.update(userId,data)
    return {user, url}
  }
}
