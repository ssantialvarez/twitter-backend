import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>

  checkFollow: (followerId: string, followedId: string) => Promise<Boolean>

  updateUser: (userId: any, data: ExtendedUserDTO) => Promise<UserViewDTO>
}
