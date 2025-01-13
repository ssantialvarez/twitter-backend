import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { CommentRepositoryImpl } from '../repository'
import { CommentService, CommentServiceImpl } from '../service'

export const commentRouter = Router()

// Use dependency injection
const service: CommentService = new CommentServiceImpl(new CommentRepositoryImpl(db))


commentRouter.get('/:postId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { limit, before, after } = req.query as Record<string, string>

    const posts = await service.getCommentsByPost(userId, { limit: Number(limit), before, after })

    return res.sendStatus(HttpStatus.OK)
})


