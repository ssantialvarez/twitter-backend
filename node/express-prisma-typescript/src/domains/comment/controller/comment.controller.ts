import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { CommentRepositoryImpl } from '../repository'
import { CommentService, CommentServiceImpl } from '../service'
import { CreatePostInputDTO } from '@domains/post/dto'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { UserRepositoryImpl } from '@domains/user/repository'
import { PostRepositoryImpl } from '@domains/post/repository'

export const commentRouter = Router()

// Use dependency injection
const service: CommentService = new CommentServiceImpl(new CommentRepositoryImpl(db), new FollowerRepositoryImpl(db), new UserRepositoryImpl(db), new PostRepositoryImpl(db))

commentRouter.post('/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const data = req.body
    
    const comment = await service.createComment(userId, postId, data)
    
    return res.status(HttpStatus.CREATED).json(comment) 
})

commentRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
    const { userId: authorId } = req.params
    const { userId } = res.locals.context

    const comments = await service.getCommentsByUser(authorId,userId)
    
    return res.status(HttpStatus.OK).json(comments)
})

commentRouter.get('/:postId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { postId } = req.params
    const { limit, before, after } = req.query as Record<string, string>

    const posts = await service.getCommentsByPost(postId, { limit: Number(limit), before, after })

    return res.status(HttpStatus.OK).json(posts)
})


