import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { FollowDTO } from '../dto'
import { FollowerRepository } from './follower.repository'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  
}
