import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { createServer } from 'http'

import { Constants, NodeEnv, Logger, setupIO, withAuth } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import path from 'path'
const { join } = require('node:path');


const app = express()
const server = createServer(app)

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Twitter Backend API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
      {
        url: "https://twitter-backend-production-2bd1.up.railway.app/api",
      },
    ],
  },
  apis: ["./src/router/index.ts"],
};

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)


app.use(express.static(path.join(__dirname, "../frontend")));

app.use('/api', router)

app.use(ErrorHandling)

app.get('/', (req, res) => {
  res.sendFile(join(__dirname,'..','frontend','pages','index.html'));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/chat.html"));
});

const specs = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

setupIO(server)

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})

export default app