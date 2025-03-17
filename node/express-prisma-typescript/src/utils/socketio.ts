import { ChatRepositoryImpl } from '@domains/chat/repository'
import { ChatService, ChatServiceImpl } from '@domains/chat/service'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowerService, FollowerServiceImpl } from '@domains/follower/service'
import { db, InternalServerErrorException } from '@utils'
import { Server as httpServer } from 'http'
import { Server } from 'socket.io'


const followerService: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))
const chatService: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))
export let io: Server

export const setupIO = (server: httpServer) => {
  io = new Server(server, {
    cors: { 
        origin: 'http://localhost:3000',  
        methods: ['GET', 'POST'],
        credentials: true                 
    },
    connectionStateRecovery: {}            
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('joinRoom', async (senderId, receiverId) => {
        const roomName = `${receiverId}_${senderId}`;
        await socket.join(roomName);
    });

    socket.on('leaveRoom', async (senderId, receiverId) => {
        const roomName = `${receiverId}_${senderId}`;
        await socket.leave(roomName);
        
    });

    socket.on('chatMessage', async (msg, receiverId, senderId) => {
        if (await followerService.isFollowing(senderId, receiverId) && await followerService.isFollowing(receiverId, senderId)) {
            try {
                const message = await chatService.createMessage(senderId, receiverId, msg);
                const roomName = `${senderId}_${receiverId}`;
                io.to(roomName).emit('chatMessage', msg, message.createdAt);
                
            } catch (e) {
                console.error(e);
            }
        }
    });

    socket.on('bringRoom', async (receiverId, senderId) => {
        const roomName = `${receiverId}_${senderId}`;
        const messages = await chatService.getChatByUserId(senderId, receiverId);
        
        
        socket.emit('chatHistory', messages);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
  });
}

