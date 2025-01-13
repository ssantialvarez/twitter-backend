import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'

export interface CommentRepository {
  getAllByDatePaginated: (postId: string, options: CursorPagination) => Promise<PostDTO[]>
  getByUserId: (authorId: string) => Promise<PostDTO[]>
  create: (userId: string, postId: string, data: CreatePostInputDTO) => Promise<PostDTO>
}
