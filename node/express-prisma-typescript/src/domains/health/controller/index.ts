export * from './health.controller'
/**
 * @swagger 
 * tags:
 *   name: Health
 * /health:
 *   get:
 *     summary: Checks server health.
 *     tags: [Health] 
 *     responses:
 *       200:
 *         description: OK.
 *       500:
 *         description: Some server error
 *
 */