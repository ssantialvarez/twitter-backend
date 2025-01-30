import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { ValidationException } from './errors'
import { plainToInstance } from 'class-transformer'
import { ClassType } from '@types'
import { db } from './database'
import { UserRepositoryImpl } from '@domains/user/repository'
import { FollowerRepositoryImpl } from '@domains/follower/repository'


export function BodyValidation<T> (target: ClassType<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.body = plainToInstance(target, req.body)
    const errors = await validate(req.body, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    if (errors.length > 0) { throw new ValidationException(errors.map(error => ({ ...error, target: undefined, value: undefined }))) }

    next()
  }
}

export async function validatesPostView(userId: string, authorId: string) {
  if(userId == authorId)
    return true

  const userRepository = new UserRepositoryImpl(db)
  const followRepository = new FollowerRepositoryImpl(db)

  const isPublic = await userRepository.isPublic(authorId)

  return (isPublic) ? isPublic : await followRepository.getFollowing(userId,authorId)
}