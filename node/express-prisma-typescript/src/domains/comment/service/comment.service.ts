import { ExtendedPostDTO } from "@domains/post/dto";
import { CursorPagination } from "@types";

export interface CommentService {
  getCommentsByPost: (postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>  
}
