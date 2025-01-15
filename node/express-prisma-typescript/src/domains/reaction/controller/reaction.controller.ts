import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'
import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { ReactionType } from '@prisma/client'



export const reactionRouter = Router()

// Use dependency injection
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))



reactionRouter.post('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  
  await service.insertReaction(userId,postId,req.query.reaction as ReactionType)

  return res.sendStatus(HttpStatus.OK)
})

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  
  await service.deleteReaction(userId,postId,req.query.reaction as ReactionType)
  

  return res.sendStatus(HttpStatus.OK)
})

reactionRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  
  const reactions = await service.getReactionByUserId(userId,req.query.reaction as ReactionType)
  
  return res.status(HttpStatus.OK).json(reactions)
})

