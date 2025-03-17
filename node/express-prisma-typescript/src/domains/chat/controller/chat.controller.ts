import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db } from '@utils'

import { ChatService, ChatServiceImpl } from '../service'
import { ChatRepositoryImpl } from '../repository'

export const chatRouter = Router()

const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

chatRouter.get('/possible_chats', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
  
    const user = await service.getPossibleChats(userId)
  
    return res.status(HttpStatus.OK).json(user)
})

chatRouter.get('/active_chats', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
  
    const user = await service.getActiveChats(userId)
  
    return res.status(HttpStatus.OK).json(user)
})