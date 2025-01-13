import { PrismaClient, Prisma, Post, ReactionType } from '@prisma/client'


import { CursorPagination } from '@types'

import { CommentRepository } from '.'
import { ExtendedPostDTO } from '@domains/post/dto'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {   

    const posts = await this.db.post.findMany({
      where:{
        author:{
          followers:{some:{followerId: userId}}
        }
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
    console.log(posts)
    //return posts.map(post => new ExtendedPostDTO(post))
    return []
    }
}

