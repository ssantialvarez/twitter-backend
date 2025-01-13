import { ExtendedPostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'

export interface CommentRepository {
  getAllByDatePaginated: (postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
}
