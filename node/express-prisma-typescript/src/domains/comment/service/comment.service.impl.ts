import { CommentService } from '.'
import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CommentRepository } from '../repository'
import { FollowerRepository } from '@domains/follower/repository'
import { UserRepository } from '@domains/user/repository'
import { PostRepository } from '@domains/post/repository'
import { generateKeyImage, generatePresignedUrl, NotFoundException } from '@utils'
import { validate } from 'class-validator'

export class CommentServiceImpl implements CommentService {
  constructor (
    private readonly repository: CommentRepository,
    private readonly followerRepository: FollowerRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository
    ) {}

  async createComment (userId: string, postId: string, data: CreatePostInputDTO): Promise<{comment: PostDTO, images: string[]}> {
    const parentPost = await this.postRepository.getById(postId)
    if(!parentPost)
      throw new NotFoundException('post')

    if(!await this.validatesPostView(userId, parentPost.authorId))
      throw new NotFoundException('post')

    await validate(data)

    let urls: string[]
    urls = []
    
    if(data.images){
      for(let image of data.images){
        image = await generateKeyImage(image)
        const presignedUrl = await generatePresignedUrl({key: image})
        urls.push(presignedUrl)
      }
    }

    const comment = await this.repository.create(userId, postId, data)
    return {comment,images: urls}
  }

  async getCommentsByUser (authorId: string, userId: string): Promise<PostDTO[]>{
    if(!await this.validatesPostView(userId,authorId)) throw new NotFoundException()

    return await this.repository.getByUserId(authorId)
  }
  
  async getCommentsByPost (postId: string, options: CursorPagination): Promise<{comments: ExtendedPostDTO[], info: {limit: Number, previousCursor: string | null, nextCursor: string | null}}> {
    options.limit = options.limit && !Number.isNaN(options.limit) ? options.limit : 50;
    
    const comments = await this.repository.getAllByDatePaginated(postId, options)
    comments.sort((a,b) => b.qtyLikes - a.qtyLikes == 0 ? (b.qtyRetweets - a.qtyRetweets == 0 ? b.qtyComments - a.qtyComments : b.qtyRetweets - a.qtyRetweets) : b.qtyLikes - a.qtyLikes)
    
    const info = {limit: options.limit, previousCursor: comments[0] ? comments[0].id: null, nextCursor: comments[0] ? comments[comments.length-1].id : null}
    return {info, comments}
  }

  private async validatesPostView(userId: string, authorId: string): Promise<Boolean> {
    const isPublic = await this.userRepository.isPublic(authorId)

    return (isPublic) ? isPublic : await this.followerRepository.getFollowing(userId,authorId)
  }

}
