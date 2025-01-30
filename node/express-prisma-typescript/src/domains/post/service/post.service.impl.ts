import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { deleteObjectByKey, ForbiddenException, generateKeyImage, generatePresignedUrl, NotFoundException, validatesPostView } from '@utils'
import { CursorPagination } from '@types'
import { FollowerRepository } from '@domains/follower/repository'
import { UserRepository } from '@domains/user/repository'

export class PostServiceImpl implements PostService {
  constructor (
    private readonly repository: PostRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<{post: PostDTO, urls: string[]}> {
    await validate(data)
    let urls: string[]
    urls = []

    if(data.images){
      for(let image of data.images){
        image = await generateKeyImage(image)
        
        data.images.shift()
        data.images.push(image)
        const presignedUrl = await generatePresignedUrl({key: image})
        urls.push(presignedUrl)
      }
    }

    const post = await this.repository.create(userId, data)

    return {post, urls}
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()

    for(let image of post.images){
      await deleteObjectByKey(image)
    }

    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post || !await validatesPostView(userId,post.authorId)) throw new NotFoundException('post')

    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    if(!await validatesPostView(userId,authorId)) throw new NotFoundException('post')
      
    return await this.repository.getByAuthorId(authorId) 
  }
  /*
  private async validatesPostView(userId: string, authorId: string): Promise<Boolean> {
    const isPublic = await this.userRepository.isPublic(authorId)

    return (isPublic) ? isPublic : await this.followRepository.getFollowing(userId,authorId)
  } 
  */ 
}
