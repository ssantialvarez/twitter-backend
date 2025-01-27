import { ChatServiceImpl } from '../src/domains/chat/service'
import { ChatRepositoryMock } from '../__mocks__/ChatRepositoryMock'
import { MessageDTO } from '../src/domains/chat/dto';
jest.mock('../src/utils/socketio.ts', () => ({}));

const service = new ChatServiceImpl(ChatRepositoryMock)


describe('Chat Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create message', () => {
    it('throws internal server error exception because reaction is incorrect', async () => {
        ChatRepositoryMock.create.mockResolvedValue(null)
        await expect(service.createMessage('a','b', 'message')).rejects.toThrow('Internal Server Error')
        expect(ChatRepositoryMock.create).toHaveBeenCalledWith('a','b', 'message')
    }),
    it('returns message succesfully', async () => {
        const messageToBeReturned = new MessageDTO({
            content: 'message',
            createdAt: new Date(),
            id: '1', 
            receiverId: 'b', 
            senderId: 'a'
        })
        ChatRepositoryMock.create.mockResolvedValue(messageToBeReturned)
        const result = await service.createMessage('a','b', 'message')
        expect(ChatRepositoryMock.create).toHaveBeenCalledWith('a','b', 'message')
        expect(result).toStrictEqual(messageToBeReturned)
    })
  }),
  describe('create message', () => {
    it('returns message succesfully', async () => {
        const messageToBeReturned = [new MessageDTO({
            content: 'message',
            createdAt: new Date(),
            id: '1', 
            receiverId: 'b', 
            senderId: 'a'
        })]
        ChatRepositoryMock.getChat.mockResolvedValue(messageToBeReturned)
        const result = await service.getChatByUserId('a','b')
        expect(ChatRepositoryMock.getChat).toHaveBeenCalledWith('a','b')
        expect(result).toStrictEqual(messageToBeReturned)
    })
  })
});
