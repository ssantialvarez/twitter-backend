import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
        deletedAt: null
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<ExtendedUserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: { deletedAt: null },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new ExtendedUserDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: { AND: [
        {OR: [
          {
            email
          },
          {
            username
          }
        ],
        deletedAt: null 
      }]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async isPublic (userId: string): Promise<Boolean> {
    const isPublic =  await this.db.user.findFirstOrThrow({
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


    return isPublic.public;
  }

  async update (userId: string, data: ExtendedUserDTO): Promise<ExtendedUserDTO>{
    return await this.db.user.update({
      where:{
        id: userId
      },
      data: data
    }).then(user => new ExtendedUserDTO(user))
  }


  async getByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]>{

    const users = await this.db.user.findMany({
      where:{
        AND: [
          {username:{
            contains:username
          },
          deletedAt: null
          }
        ]
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
    return users.map(user => new UserViewDTO(user))
  }



}
