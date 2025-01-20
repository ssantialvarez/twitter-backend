import { ChatRepositoryImpl } from '@domains/chat/repository'
import { ChatService, ChatServiceImpl } from '@domains/chat/service'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { ConflictException, db } from '@utils'
import { Server as httpServer } from 'http'
import { send } from 'process'
import { Server } from 'socket.io'
import { threadId } from 'worker_threads'

const followerService: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))
const chatService: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))
export let io: Server

export const setupIO = (server: httpServer) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    connectionStateRecovery: {}
  })

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', async (senderId, receiverId) => {
      await socket.join(senderId + "_" + receiverId)
    })
    socket.on('leave room', async (senderId, receiverId) => {
      await socket.leave(senderId + "_" + receiverId);
    });
  
    

    socket.on('chat message', async (msg, receiverId, senderId) => {

      if(await followerService.isFollowing(senderId, receiverId) && await followerService.isFollowing(receiverId, senderId)){
        try{
          const message = await chatService.createMessage(senderId,receiverId,msg)
          io.to(senderId + "_" + receiverId).emit('chat message', msg, message.createdAt);
        }catch(e){
          throw new ConflictException()
        }
        
      }
    });

    socket.on('bring room', async (receiverId, senderId) => {
      const messages = await chatService.getChatByUserId(senderId,receiverId)
      messages.map(msg => io.to(receiverId + "_" + senderId).emit('chat message', msg.content, msg.createdAt))
    });


    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

  });
}

