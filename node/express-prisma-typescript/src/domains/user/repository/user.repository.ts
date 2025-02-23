import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UpdateInputDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (userId: string, options: OffsetPagination) => Promise<ExtendedUserDTO[]>
  getById: (userId: string) => Promise<ExtendedUserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  
  getByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>

  isPublic: (userId: string) => Promise<Boolean>
  update: (userId: string, data:UpdateInputDTO) => Promise<ExtendedUserDTO>
}
