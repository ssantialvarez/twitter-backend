export * from './follower.controller'
/**
 * @swagger
 * components:
 *   parameters:
 *     UserId:
 *       in: path
 *       name: userId # Note the name is the same as in the path
 *       required: true
 *       schema:
 *         type: integer
 *         minimun: 1
 *       description: The user ID
 *   securitySchemes:
 *     bearerAuth: # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT # optional, arbitrary value for documentation purposes
 *   responses:  
 *        UnauthorizedError:
 *           description: Access token is missing or invalid
 * 
 * tags:
 *   name: Follower
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
 * 
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
 * 
 *       500:
 *         description: Some server error  
 */