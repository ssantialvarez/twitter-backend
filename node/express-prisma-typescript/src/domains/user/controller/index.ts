export * from './user.controller'
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
 *   schemas:
 *     User:
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
 *   responses:  
 *        UnauthorizedError:
 *           description: Access token is missing or invalid
 * 
 * tags:
 *   name: User
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
 *               $ref: '#/components/schemas/User'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update your user information.
 *     tags: [User]
 *     requestBody:
 *       content: 
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/User' 
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete your user.
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error
 * /user/me:
 *   get:
 *     summary: Get information about your current user.
 *     tags: [User]
 *     security: 
 *       - bearerAuth: [] # use the same name as above
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *               $ref: '#/components/schemas/User'
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Some server error 
 */