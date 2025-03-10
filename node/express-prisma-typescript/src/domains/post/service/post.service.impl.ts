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

  async createPost (userId: string, data: CreatePostInputDTO): Promise<{post: PostDTO, images: string[]}> {
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

    return {post, images: urls}
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

  async getPost (userId: string, postId: string): Promise<ExtendedPostDTO> {
    const post = await this.repository.getById(postId)
    if (!post || !await validatesPostView(userId,post.authorId)) throw new NotFoundException('post')

    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<{posts: ExtendedPostDTO[], info: {limit: Number, previousCursor: string, nextCursor: string}}> {
    options.limit = options.limit && !Number.isNaN(options.limit) ? options.limit : 50;
    let previousCursor : string = '';
    let nextCursor : string = '';
    
    const posts = await this.repository.getAllByDatePaginated(userId, {limit: options.limit, after: options.after, before: options.before})
    if(posts.length > 0){
      previousCursor = posts[0].id;
      nextCursor = posts[posts.length-1].id;
    }
    
    const info = {limit: options.limit, previousCursor, nextCursor}
    return {info, posts}
  }

  async getPostsByFollows (userId: string, options: CursorPagination): Promise<{posts: ExtendedPostDTO[], info: {limit: Number, previousCursor: string, nextCursor: string}}> {
    options.limit = options.limit && !Number.isNaN(options.limit) ? options.limit : 50;
    let previousCursor : string = '';
    let nextCursor : string = '';
    
    const posts = await this.repository.getByFollow(userId, {limit: options.limit, after: options.after, before: options.before})
    if(posts.length > 0){
      previousCursor = posts[0].id;
      nextCursor = posts[posts.length-1].id;
    }
    
    const info = {limit: options.limit, previousCursor, nextCursor}
    return {info, posts}
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    if(!await validatesPostView(userId,authorId)) 
      throw new NotFoundException('posts. Account may be private.')
    return await this.repository.getByAuthorId(authorId) 
  }
}
