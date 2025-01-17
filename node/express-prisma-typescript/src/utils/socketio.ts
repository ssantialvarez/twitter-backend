import { Server as httpServer } from 'http'
import { Server } from 'socket.io'


export let io: Server

export const setupIO = (server: httpServer) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    connectionStateRecovery: {}
  })


  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.join
  });
}

