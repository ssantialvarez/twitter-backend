import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
//added follower router
import { followerRouter } from '@domains/follower'
import { reactionRouter } from '@domains/reaction'
import { commentRouter } from '@domains/comment'
import { chatRouter } from '@domains/chat'

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
router.use('/comment', withAuth, commentRouter)
router.use('/follower', withAuth, followerRouter)
router.use('/reaction', withAuth, reactionRouter)
router.use('/chat', withAuth, chatRouter)


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         authorId:
 *           type: string
 *         content:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 4
 *         createdAt:
 *           type: string
 *           format: date 
 *     ExtendedPost:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         authorId:
 *           type: string
 *         content:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 4
 *         createdAt:
 *           type: string
 *           format: date
 *         author:
 *           $ref: '#/components/schemas/ExtendedUser'
 *         qtyComments:
 *           type: integer   
 *         qtyLikes:
 *           type: integer
 *         qtyRetweets:
 *           type: integer
 *     Token:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token 
 *     PresignedURL:
 *       type: string
 *       description: A presigned url to upoload images to the Amazon S3 bucket.
 *     UserView:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         profilePicture:
 *           type: string
 *           description: The name of the profile picture.         
 *     ExtendedUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         profilePicture:
 *           type: string
 *           description: The name of the profile picture.
 *         public:
 *           type: boolean
 *           description: The public status of the user.
 *         createdAt:
 *           type: string
 *           format: date  
 *   parameters:
 *     PostId:
 *       name: postId 
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: The post ID. 
 *     UserId:
 *       in: path
 *       name: userId 
 *       required: true
 *       schema:
 *         type: string
 *       description: The user ID
 *     Username:
 *       in: path
 *       name: username 
 *       required: true
 *       schema:
 *         type: string
 *       description: The user's username.
 *     Reaction:
 *       in: query
 *       name: reaction
 *       required: true
 *       schema:
 *         type: string
 *         enum: [LIKE, RETWEET]         
 *       description: Specifies whether the user LIKES a post or RETWEETS it.   
 *   requestBodies:
 *     UserCredentials:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - username
 *                  - email
 *                  - password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: The username of the user.
 *                  email:
 *                      type: string
 *                      description: The email address of the user.
 *                  password:
 *                      type: string
 *                      description: The password for the user account.
 *     CreatePost:
 *       description: Content of the post.
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - content                  
 *              properties:
 *                content: 
 *                  type: string
 *                images: 
 *                  type: array
 *                  items: 
 *                    type: string
 *                  maxItems: 4 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:  
 *        UnauthorizedError:
 *           description: Access token is missing or invalid 
 *  
 * tags:
 *  - name: Auth
 *  - name: User 
 *  - name: Post
 *  - name: Follower
 *  - name: Comment
 *  - name: Reaction
 *  - name: Health
 * 
 * 
 * /health:
 *   get:
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *        $ref: '#/components/requestBodies/UserCredentials'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       500:
 *         description: Some server error
 * 
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserCredentials'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       500:
 *         description: Some server error
 *
 * 
 * 
 * /follower/follow/{userId}:
 *   post:
 *     summary: Follows a certain user by ID.
 *     tags: [Follower]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *
 * /follower/unfollow/{userId}:
 *   post:
 *     summary: Unfollows a certain user by ID.
 *     tags: [Follower]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId' 
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error 
 * /follower/followers:
 *   get:
 *     summary: Get a list of your followers.
 *     tags: [Follower]
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref:'#/components/schemas/UserView'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * /follower/followed:
 *   get:
 *     summary: Get a list of  user you follow.
 *     tags: [Follower]
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref:'#/components/schemas/UserView'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error 
 * 
 * /user:
 *   get:
 *     summary: Get a list of recommended Users to follow.
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref:'#/components/schemas/UserView'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update your user information.
 *     tags: [User]
 *     requestBody:
 *       content: 
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/ExtendedUser' 
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/ExtendedUser'
 *                   - $ref: '#/components/schemas/PresignedURL'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete your user.
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Deleted user.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * /user/me:
 *   get:
 *     summary: Get information about your current user.
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserView'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
 *       500:
 *         description: Some server error
 *       
 * /user/{userId}:
 *   get:
 *     summary: Get an user by id.
 *     parameters:
 *        - $ref: '#/components/parameters/UserId'
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/UserView'
 *                   - type: string
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * /user/by_username/{username}:
 *   get:
 *     summary: Get a list of users by username.
 *     parameters:
 *        - $ref: '#/components/parameters/Username'
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserView'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error 
 *   
 * /post:
 *   get:
 *     summary: Get the posts of the users you follow.
 *     tags: [Post]
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPost'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Create a post.
 *     tags: [Post]
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreatePost'
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Post'
 *                   - type: array
 *                     items:
 *                       $ref: '#/components/schemas/PresignedURL'
 *                     maxItems: 4 
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * 
 * /post/{postId}:
 *   get:
 *     summary: Get a posts by Id
 *     parameters: 
 *       - $ref: '#/components/parameters/PostId'
 *     tags: [Post]
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete a post.
 *     parameters: 
 *       - $ref: '#/components/parameters/PostId'
 *     tags: [Post]
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Deleted post 68d5c2dd-6ebc-4dc5-917f-39a9774f3617
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbbiden. You are not allowed to delete others posts.
 *       500:
 *         description: Some server error 
 * /post/by_user/{postId}:
 *   get:
 *     summary: Get the posts of a determined user by Id.
 *     parameters: 
 *       - $ref: '#/components/parameters/PostId'
 *     tags: [Post]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPost'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Not found user.
 *       500:
 *         description: Some server error 
 *
 * /comment/{postId}:
 *   post:
 *     summary: Comments a certain post by ID.
 *     tags: [Comment]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreatePost'
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation Error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Get comments of a certain post by ID.
 *     tags: [Comment]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPost'
 *       400:
 *         description: Validation Error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * /comment/by_user/{userId}:
 *   get:
 *     summary: Get user's comments by user id.
 *     parameters:
 *        - $ref: '#/components/parameters/UserId'
 *     tags: [Comment]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * 
 * /reaction/{postId}:
 *   post:
 *     summary: Reacts (like or retweet) a certain post by ID.
 *     tags: [Reaction]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *       - $ref: '#/components/parameters/Reaction'
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Deletes the reaction of a certain post by ID.
 *     tags: [Reaction]
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *       - $ref: '#/components/parameters/Reaction' 
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                    postId: 
 *                      type: string
 *                    userId: 
 *                      type: string
 *                    reaction: 
 *                      type: string
 *                    createdAt: 
 *                      type: string
 *                      format: date  
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * 
 * /reaction/{userId}:
 *   get:
 *     summary: Get reactions of a certain user by Id.
 *     tags: [Reaction]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *       - $ref: '#/components/parameters/Reaction'
 *     security: 
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error  
 * 
 *        
 */
