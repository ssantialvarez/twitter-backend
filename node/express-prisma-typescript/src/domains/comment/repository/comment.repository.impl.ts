import { PrismaClient, Prisma, Post, ReactionType } from '@prisma/client'


import { CursorPagination } from '@types'

import { CommentRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { ExtendedUserDTO, UserViewDTO } from '@domains/user/dto'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}

  
  async create (userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO> {

    const comment = await this.db.post.create({
      data:{
        authorId: userId,
        parentPostId: postId,
        ...data
      }
    })

    return new PostDTO(comment)
  } 

  async getByUserId(authorId: string): Promise<PostDTO[]>{
    const comments = await this.db.post.findMany({
      where:{
        authorId: authorId,
        parentPostId: {not: null}
      }
    })

    return comments.map(com => new PostDTO(com))
  }
  
  
  async getAllByDatePaginated (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {   

    const comments = await this.db.post.findMany({
      include:{
        author: true,
        reactions: true,
        _count: {select: {comments: true}}
      },
      where:{
        parentPostId: postId
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          reactions: {_count: 'desc'}
          
        }
      ]
    })
    
    return comments.map(comment => new ExtendedPostDTO({
          ...comment,
          author: new UserViewDTO(comment.author),
          qtyComments: comment._count.comments,
          qtyLikes: comment.reactions.filter(reaction => reaction.reaction == ReactionType.LIKE).length,
          qtyRetweets: comment.reactions.filter(reaction => reaction.reaction == ReactionType.RETWEET).length
        }))
    }
}

