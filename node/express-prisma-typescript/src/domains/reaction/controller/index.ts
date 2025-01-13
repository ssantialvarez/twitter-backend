export * from './reaction.controller'
/**
 * @swagger
 * components:
 *   parameters:
 *     Reaction:
 *       in: query
 *       name: reaction
 *       required: true
 *       schema:
 *         type: string
 *         
 *       description: Specifies whether the user LIKES a post or RETWEETS it. 
 *     PostId:
 *       in: path
 *       name: postId # Note the name is the same as in the path
 *       required: true
 *       schema:
 *         type: integer
 *         minimun: 1
 *       description: The post ID
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT # optional, arbitrary value for documentation purposes
 *   responses:  
 *        UnauthorizedError:
 *           description: Access token is missing or invalid
 * 
 * tags:
 *   name: Reaction
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
 *         description: OK.
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error 
 */