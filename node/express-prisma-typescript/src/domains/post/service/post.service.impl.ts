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
    // TODO: validate that the author has public profile or the user follows the author
    // almost done
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')

    const isPublic = await this.userRepository.isPublic(post.authorId)
    const isFollowing = await this.followRepository.isFollowing(userId,post.authorId)
        
    if(!isPublic && isFollowing)
      throw new NotFoundException("Post")
    
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    // done

    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    // almost done
    const isPublic = await this.userRepository.isPublic(authorId)
    const isFollowing = await this.followRepository.isFollowing(userId,authorId)

    if(!(isPublic || isFollowing))
      throw new NotFoundException("Post")

    return await this.repository.getByAuthorId(authorId) 
  }
}
