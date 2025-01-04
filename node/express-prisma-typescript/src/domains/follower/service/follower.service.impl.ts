import { FollowDTO } from '../dto'
import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

}
