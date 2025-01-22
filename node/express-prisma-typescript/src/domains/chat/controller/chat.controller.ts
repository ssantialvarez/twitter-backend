import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { ChatService, ChatServiceImpl } from '../service'
import { ChatRepositoryImpl } from '../repository'

export const chatRouter = Router()

// Use dependency injection
const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))


chatRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: senderId } = res.locals.context
  const { userId: receiverId } = req.params
  
  const messages = await service.getChatByUserId(senderId,receiverId)
  
  return res.status(HttpStatus.OK).json(messages)
})
