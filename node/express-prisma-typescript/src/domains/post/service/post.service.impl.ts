import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { deleteObjectByKey, ForbiddenException, generatePresignedUrl, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowerRepository } from '@domains/follower/repository'
import { UserRepository } from '@domains/user/repository'
import {v4 as uuidv4} from 'uuid';


export class PostServiceImpl implements PostService {
  constructor (
    private readonly repository: PostRepository, 
    private readonly followRepository: FollowerRepository, 
    private readonly userRepository: UserRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<{post: PostDTO, urls: string[]}> {
    await validate(data)
    let urls: string[]
    urls = []

    if(data.images){
      for(let i = 0; i < data.images.length; i++){
        let image = data.images.pop() as string
        let arr = image.split('.')
        let imageName = arr.at(0) as string
        imageName = imageName.concat("__"+uuidv4())
        image = imageName.concat('.'+arr.at(1))
        data.images.unshift(image)
        
        const presignedUrl = await generatePresignedUrl({key: image})
        urls.unshift(presignedUrl)
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
    if (!post) throw new NotFoundException('post')

    this.validatesPostView(userId,post.authorId)
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    
    this.validatesPostView(userId,authorId)
    return await this.repository.getByAuthorId(authorId) 
  }

  private async validatesPostView(userId: string, authorId: string) {
    const isPublic = await this.userRepository.isPublic(authorId)
    const isFollowing = await this.followRepository.isFollowing(userId,authorId)

    if(!(isPublic || isFollowing))
      throw new NotFoundException("Post")
  }  

}
