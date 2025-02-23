import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: { limit: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getByFollow: (userId: string, options: { limit: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId: (authorId: string) => Promise<ExtendedPostDTO[]>
}
