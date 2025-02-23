import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<{post: PostDTO, urls: string[]}>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<ExtendedPostDTO>
  getPostsByFollows: (userId: string, options: CursorPagination) => Promise<{posts: ExtendedPostDTO[], info: {limit: Number, previousCursor: string, nextCursor: string}}>
  getLatestPosts: (userId: string, options: CursorPagination) => Promise<{posts: ExtendedPostDTO[], info: {limit: Number, previousCursor: string, nextCursor: string}}>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<ExtendedPostDTO[]>
}
