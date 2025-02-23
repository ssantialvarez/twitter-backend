import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UpdateInputDTO, UserProfileDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserProfile: (userId: string) => Promise<UserProfileDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<{users: UserViewDTO[], info: {limit: Number, nextSkip: Number | undefined}}>
  getUsersByUsername: (username: string, options: OffsetPagination) => Promise<{users: UserViewDTO[], info: {limit: Number, nextSkip: Number | undefined}}>
  updateUser: (userId: any, data: UpdateInputDTO) => Promise<{user: ExtendedUserDTO, url: string}>
  checkFollow: (followerId: string, followedId: string) => Promise<Boolean>
}
