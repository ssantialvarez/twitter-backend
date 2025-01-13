import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>

  getByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  updateUser: (userId: any, data: ExtendedUserDTO) => Promise<UserViewDTO>

  checkFollow: (followerId: string, followedId: string) => Promise<Boolean>
}
