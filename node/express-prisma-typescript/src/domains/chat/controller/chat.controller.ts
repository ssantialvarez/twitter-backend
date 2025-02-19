import { Router } from 'express'

import 'express-async-errors'

import { db } from '@utils'

import { ChatService, ChatServiceImpl } from '../service'
import { ChatRepositoryImpl } from '../repository'

export const chatRouter = Router()

const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

