import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'
//import { CreatePostInputDTO } from '../dto'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  

  return res.status(HttpStatus.ACCEPTED)
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const data = req.body
  
    
  
    return res.status(HttpStatus.CREATED)
  })
