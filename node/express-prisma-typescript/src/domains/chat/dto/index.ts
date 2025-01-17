

export class MessageDTO {
    constructor (chat: MessageDTO) {
      this.id = chat.id
      this.senderId = chat.senderId
      this.receiverId = chat.receiverId
      this.content = chat.content
      this.roomId = chat.roomId
      this.createdAt = chat.createdAt
    }
  
    id: string
    senderId: string
    receiverId: string
    content: string
    roomId: string
    createdAt: Date
  }
  