import { PrismaClient, ReactionType } from '@prisma/client'


import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { ExtendedUserDTO, UserViewDTO } from '@domains/user/dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {   
    const posts = await this.db.post.findMany({
      include:{
        author: true,
        reactions: true,
        _count: {select: {comments: true}}
      },
      where:{
        author:{
          OR:[{
            followers:{some:{followerId: userId}}
          },
          {public: true}
          ]
        },
        parentPostId: null,
        deletedAt: null
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    
    return posts.map(post => new ExtendedPostDTO({
      ...post,
      author: new UserViewDTO(post.author),
      qtyComments: post._count.comments,
      qtyLikes: post.reactions.filter(reaction => reaction.reaction == ReactionType.LIKE).length,
      qtyRetweets: post.reactions.filter(reaction => reaction.reaction == ReactionType.RETWEET).length
    }))
    }

  async delete (postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
        deletedAt: null
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<ExtendedPostDTO[]> {
    
    const posts = await this.db.post.findMany({
      include:{
        author: true,
        reactions: true,
        _count: {select: {comments: true}}
      },
      where: {
        authorId,
        deletedAt: null
      }
    })

    
    return posts.map(post => new ExtendedPostDTO({
      ...post,
      author: new UserViewDTO(post.author),
      qtyComments: post._count.comments,
      qtyLikes: post.reactions.filter(reaction => reaction.reaction == ReactionType.LIKE).length,
      qtyRetweets: post.reactions.filter(reaction => reaction.reaction == ReactionType.RETWEET).length
    }))
  }
}
