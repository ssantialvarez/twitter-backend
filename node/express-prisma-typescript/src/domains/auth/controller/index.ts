export * from './auth.controller'

/**
 * @swagger
 * components:
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
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 * tags:
 *   name: Auth
 * /signup:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *        $ref: '#/components/requestBodies/UserCredentials'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       500:
 *         description: Some server error
 * 
 * /login:
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
 *       401:
 *          $ref: '#/components/responses/UnauthorizedError'
 * 
 *       500:
 *         description: Some server error
 *  
 */