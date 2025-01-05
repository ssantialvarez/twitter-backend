import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'
import { FollowDTO } from '../dto'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
  const { userId: followerId } = res.locals.context
  const { userId: followedId } = req.params
  
  service.followUser(followerId,followedId)
  
  return res.status(HttpStatus.ACCEPTED)
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
  const { followerId } = res.locals.context
  const { userId: followedId } = req.params
  
  service.unfollowUser(followerId, followedId)  
  
  return res.status(HttpStatus.CREATED)
})
