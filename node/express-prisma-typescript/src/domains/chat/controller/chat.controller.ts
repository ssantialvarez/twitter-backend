import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, io } from '@utils'

import { ChatService, ChatServiceImpl } from '../service'
import { ChatRepositoryImpl } from '../repository'

export const chatRouter = Router()

// Use dependency injection
const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

chatRouter.post('/:userId', async (req: Request, res: Response) => {
  const { userId: senderId } = res.locals.context
  const { userId: receiverId } = req.params
  const data = req.body
  
  const message = await service.createMessage(senderId,receiverId,data.content)
  io.emit('chat message', message.content)
  
  return res.status(HttpStatus.OK).json(message)
})

chatRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
