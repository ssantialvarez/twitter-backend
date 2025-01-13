import { CommentService } from '.'
import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CommentRepository } from '../repository'
import { FollowerRepository } from '@domains/follower/repository'
import { UserRepository } from '@domains/user/repository'
import { PostRepository } from '@domains/post/repository'
import { NotFoundException } from '@utils'

export class CommentServiceImpl implements CommentService {
  constructor (
    private readonly repository: CommentRepository,
    private readonly followerRepository: FollowerRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository
    ) {}

  async createComment (userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const parentPost = await this.postRepository.getById(postId)
    if(parentPost == null)
      throw new NotFoundException('post')

    const authorIsPublic = await this.userRepository.isPublic(parentPost.authorId)
    const follows = await this.followerRepository.isFollowing(userId,parentPost.authorId)
    
    if(!(authorIsPublic || follows))
      throw new NotFoundException('post')

  
    return await this.repository.create(userId, postId, data)
  }

  async getCommentsByUser (authorId: string, userId: string): Promise<PostDTO[]>{

    return await this.repository.getByUserId(authorId)

  }
  
  async getCommentsByPost (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    
    return await this.repository.getAllByDatePaginated(postId, options)
  
  }
}
