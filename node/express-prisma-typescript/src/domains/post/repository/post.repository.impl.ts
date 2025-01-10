import { PrismaClient, Prisma, Post, ReactionType } from '@prisma/client'


import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { reactionRouter } from '@domains/reaction'

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

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<PostDTO[]> {   

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
    return posts.map(post => new PostDTO(post))
    

    /*
    const limit = options.limit ?  options.limit : null
    const offset = options.after ?? options.before ? 1 : 0
    
    let subQuery

    if(options.before){
      let aux = Prisma.sql`SELECT * FROM "public"."Post" WHERE ("id") = (${options.before}::uuid) LIMIT 1`
      const [result] = await this.db.$queryRaw<Post[]>(aux)
      subQuery = Prisma.sql`WHERE (("t1"."createdAt" = ${result.createdAt}::timestamp without time zone AND "t1"."id" <= ${result.id}::uuid) OR "t1"."createdAt" > ${result.createdAt}::timestamp without time zone) ORDER BY "t1"."createdAt" ASC, "t1"."id" DESC `
    } else if(options.after){
      let aux = Prisma.sql`SELECT * FROM "public"."Post" WHERE ("id") = (${options.after}::uuid) LIMIT 1`
      const [result] = await this.db.$queryRaw<Post[]>(aux)
      subQuery = Prisma.sql`WHERE (("t1"."createdAt" = ${result.createdAt}::timestamp without time zone AND "t1"."id" >= ${result.id}::uuid) OR "t1"."createdAt" < ${result.createdAt}::timestamp without time zone) ORDER BY "t1"."createdAt" DESC, "t1"."id" ASC `
    }else{
      subQuery = Prisma.sql`ORDER BY "t1"."createdAt" DESC, "t1"."id" ASC `
    }
    let query = Prisma.sql`SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"
    FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = ${userId}::uuid AND "t2"."deletedAt" is null) 
    ${subQuery}
    LIMIT ${limit}
    OFFSET ${offset}`    
    
    let posts = await this.db.$queryRaw<Post[]>(query)

    
    
    if(options.before)
      posts.sort(compare)
    return posts.map(post => new PostDTO(post))
    */
    }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    
    /*
    const usersWithCount = await this.db.post.findMany({
      select: {
        _count: {
          select: {reactions: {where: {reaction: ReactionType.LIKE}}}
        },
      },
    })
    console.log(usersWithCount)
    */
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }
}



const compare = function(a:Post, b:Post) {
  const comp = b.createdAt.getTime() - a.createdAt.getTime()
  if(comp == 0){
    return b.id.localeCompare(a.id)
  }
  return comp
}