import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UpdateInputDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>

  getUsersByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  updateUser: (userId: any, data: UpdateInputDTO) => Promise<{user: ExtendedUserDTO, url: string}>

  checkFollow: (followerId: string, followedId: string) => Promise<Boolean>
}
