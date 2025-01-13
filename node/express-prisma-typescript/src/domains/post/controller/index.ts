export * from './post.controller'

/**
 * @swagger
 * components:
 *   parameters:
 *     PostId:
 *       name: postId # Note the name is the same as in the path
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *         minimun: 1
 *       description: The post ID.
 *   securitySchemes:
 *     bearerAuth: # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT # optional, arbitrary value for documentation purposes
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - authorId
 *         - content
 *       properties:
 *         id:
 *           type: string
 *         authorId:
 *           type: string
 *         content:
 *           type: string
 *         images:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date
 *   responses:  
 *        UnauthorizedError:
 *           description: Access token is missing or invalid
 * 
 * tags:
 *   name: Post
 * /post:
 *   get:
 *     summary: Get the posts of the users you follow.
 *     tags: [Post]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
 *       500:
 *         description: Some server error
 *   post:
 *     summary: Create a post.
 *     tags: [Post]
 *     requestBody:
 *       description: Content of the post.
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                content: string
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
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
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
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
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
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
 *               $ref: '#/components/schemas/Post'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
 *       500:
 *         description: Some server error
 */