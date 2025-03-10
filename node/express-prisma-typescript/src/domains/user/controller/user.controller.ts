import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation, db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { UpdateInputDTO } from '../dto'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db), new FollowerRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUserProfile(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const { userId } = res.locals.context
  
  const user = await service.getUser(otherUserId)
  const followsYou = await service.checkFollow(otherUserId, userId)
    
  return res.status(HttpStatus.OK).json({user, followsYou})
})

userRouter.get('/profile/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  
  const user = await service.getUserProfile(otherUserId)
  
  return res.status(HttpStatus.OK).json(user)
})


userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, skip } = req.query as Record<string, string>
  
  const users = await service.getUsersByUsername(username, { limit: Number(limit), skip: Number(skip) })
  
  return res.status(HttpStatus.OK).json(users)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK).send(`Deleted user ${userId}`)
})

userRouter.put('/', BodyValidation(UpdateInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const user_url = await service.updateUser(userId, data)

  return res.status(HttpStatus.OK).json(user_url)
})

