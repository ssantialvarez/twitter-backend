import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
  const { userId: followerId } = res.locals.context
  const { userId: followedId } = req.params
  
  await service.followUser(followerId,followedId)
  
  return res.sendStatus(HttpStatus.OK)
})

followerRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
  const { userId: followerId } = res.locals.context
  const { userId: followedId } = req.params
  
  await service.unfollowUser(followerId, followedId)  
  
  return res.sendStatus(HttpStatus.OK)
})
