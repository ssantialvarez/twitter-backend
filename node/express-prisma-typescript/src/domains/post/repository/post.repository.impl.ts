import { PrismaClient, Prisma, Post } from '@prisma/client'


import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'

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
    
    
    const limit = options.limit ?  options.limit.toString() : 'ALL'
    const offset = options.after ?? options.before ? 1 : 0
    
    
    let aux = Prisma.sql`SELECT * FROM "public"."Post" WHERE ("id") = (${options.before}::uuid) LIMIT 1`
    const result = await this.db.$queryRaw<Post>(aux);
    console.log(result)
    console.log(result.id)
    console.log(result.createdAt)
    


    let query = Prisma.sql`SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"`
    

    /*
    const select = `SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"`
    const from = `FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = ${userId}::uuid AND "t2"."deletedAt" is null)`
    if(options.before){
      query = Prisma.sql` 
      SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"
      FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = ${userId}::uuid AND "t2"."deletedAt" is null)
      WHERE ((
        "t1"."createdAt" = (SELECT "t3"."createdAt" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.before}::uuid) LIMIT 1) 
        AND "t1"."id" <= (SELECT "t3"."id" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.before}::uuid) LIMIT 1)) 
        OR ("t1"."createdAt" > (SELECT "t3"."createdAt" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.before}::uuid) LIMIT 1)))
      ORDER BY "t1"."createdAt" ASC, "t1"."id" DESC 
      LIMIT ${limit}
      OFFSET ${offset}`
      
    }else if(options.after){
      query = Prisma.sql` 
      SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"
      FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = ${userId}::uuid AND "t2"."deletedAt" is null)
      WHERE ((
        "t1"."createdAt" = (SELECT "t3"."createdAt" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.after}::uuid)) 
        AND "t1"."id" >= (SELECT "t3"."id" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.after}::uuid))) 
        OR ("t1"."createdAt" < (SELECT "t3"."createdAt" FROM "public"."Post" AS "t3" WHERE ("t3"."id") = (${options.after}::uuid))))
      ORDER BY "t1"."createdAt" DESC, "t1"."id" ASC 
      LIMIT ${limit}
      OFFSET ${offset}`
    }else{
      query = Prisma.sql` 
      SELECT "t1"."id", "t1"."authorId", "t1"."content", "t1"."images", "t1"."createdAt"
      FROM ("public"."Post" AS "t1" JOIN "public"."Follow" AS "t2" ON "t1"."authorId" = "t2"."followedId" AND "t2"."followerId" = (${userId}::uuid) AND "t2"."deletedAt" is null)
      ORDER BY "t1"."createdAt" DESC, "t1"."id" ASC 
      LIMIT ${limit}
      OFFSET ${offset}`

    }
    */
    const posts = await this.db.post.findMany({
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
    
    return posts.map(post => new PostDTO(post))
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
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }
}
