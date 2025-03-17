import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UpdateInputDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'
import { InternalServerErrorException } from '@utils'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findUnique({
      include:{
        followers: {select: {followerId: true}, where:{deletedAt: null}},
        follows: {select: {followedId: true}, where:{deletedAt: null}},
      },
      where: {
        id: userId,
        deletedAt: null
      }
    })
    return user ? new ExtendedUserDTO({ ...user, followers: user.followers.flatMap((fol) => fol.followerId), following: user.follows.flatMap((fol) => fol.followedId)}) : null
  }

  async delete (userId: string): Promise<void> {
    try{
      await this.db.user.update({
        where: {
          id: userId,
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        }
      })
      await this.db.post.updateMany({
        where: {
          authorId: userId,
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        }
      })
    }catch(e){
      throw new InternalServerErrorException()
    }
  }

  async getRecommendedUsersPaginated (userId: string,options: OffsetPagination): Promise<ExtendedUserDTO[]> {
    const followed = await this.db.follow.findMany({
      select: {followedId: true},
      where: {followerId: userId, deletedAt: null}
    })

    const followedIds: string[] = followed.map(fol => fol.followedId)
    followedIds.push(userId)
    
    const users = await this.db.user.findMany({
      distinct: "id",
      include:{
        followers: {select: {followerId: true}},
        follows: {select: {followedId: true}},
      },
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: { 
        deletedAt: null,
        id: {notIn: followedIds},
        followers: {some: {followerId: {in: followedIds}}}
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new ExtendedUserDTO({ ...user, followers: user.followers.flatMap((fol) => fol.followerId), following: user.follows.flatMap((fol) => fol.followedId)}))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      include:{
        followers: {select: {followerId: true}},
        follows: {select: {followedId: true}},
      },
      where: { 
        OR: [
          {
            email
          },
          {
            username:{
              contains: username,
              mode: 'insensitive'
            }
          }
        ],
        deletedAt: null 
      
      }
    })
    return user ? new ExtendedUserDTO({ ...user, followers: user.followers.flatMap((fol) => fol.followerId), following: user.follows.flatMap((fol) => fol.followedId)}) : null
  }

  async isPublic (userId: string): Promise<Boolean> {
    const isPublic =  await this.db.user.findFirst({
      where: {
        AND:[
          {
            deletedAt: null,
            id: userId
          }        
        ]
      },
      select: { public: true }
    })


    return isPublic?.public ?? false;
  }

  async update (userId: string, data: UpdateInputDTO): Promise<ExtendedUserDTO>{
    return await this.db.user.update({
      include:{
        followers: {select: {followerId: true}},
        follows: {select: {followedId: true}},
      },
      where:{
        id: userId
      },
      data: data
    }).then(user => new ExtendedUserDTO({ ...user, followers: user.followers.flatMap((fol) => fol.followerId), following: user.follows.flatMap((fol) => fol.followedId)}))
  }


  async getByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]>{
    const users = await this.db.user.findMany({
      where:{
        AND: [
          {username:{
            contains:username,
            mode:'insensitive'
          },
          deletedAt: null
          }
        ]
      },
      take: options.limit,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }
}
