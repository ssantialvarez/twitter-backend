

export class MessageDTO {
    constructor (chat: MessageDTO) {
      this.id = chat.id
      this.senderId = chat.senderId
      this.receiverId = chat.receiverId
      this.content = chat.content
      this.createdAt = chat.createdAt
    }
  
    id: string
    senderId: string
    receiverId: string
    content: string
    createdAt: Date
  }
  