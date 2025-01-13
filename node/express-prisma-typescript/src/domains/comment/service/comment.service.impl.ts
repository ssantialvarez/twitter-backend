import { CommentService } from '.'
import { validate } from 'class-validator'
import { CursorPagination } from '@types'
import { ExtendedPostDTO } from '@domains/post/dto'
import { CommentRepository } from '../repository'

export class CommentServiceImpl implements CommentService {
  constructor (
    private readonly repository: CommentRepository
    ) {}

  async getCommentsByPost (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    
    return await this.repository.getAllByDatePaginated(postId, options)
  
  }
}
