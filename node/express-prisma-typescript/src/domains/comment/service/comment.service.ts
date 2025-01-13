import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CursorPagination } from "@types";

export interface CommentService {
  getCommentsByUser: (authorId: string, userId: string) => Promise<PostDTO[]>
  getCommentsByPost: (postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  createComment: (userId: string, postId: string, data: CreatePostInputDTO) => Promise<PostDTO>
}
