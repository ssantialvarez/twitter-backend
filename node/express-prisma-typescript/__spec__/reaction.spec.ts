import { ReactionServiceImpl } from '../src/domains/reaction/service';
import { ReactionRepositoryMock } from '../__mocks__/ReactionRepositoryMock'
import { ReactionType } from "@prisma/client";
import { ReactionDTO } from '../src/domains/reaction/dto';

const service = new ReactionServiceImpl(ReactionRepositoryMock)

describe('Reaction Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('insert reaction', () => {
    it('throws bad request exception because reaction is incorrect', async () => {
        await expect(service.insertReaction('a', '1', 'lie' as ReactionType)).rejects.toThrow('Bad Request')
        expect(ReactionRepositoryMock.insert).not.toHaveBeenCalled()
    }),
    it('returns reaction dto', async () => {
        const reaction = new ReactionDTO({
            createdAt: new Date(),
            postId: '1',
            reaction: 'LIKE',
            userId: 'a'
        })
        ReactionRepositoryMock.insert.mockResolvedValue(reaction)
        const result = await service.insertReaction('a', '1', 'LIKE')
        expect(result).toStrictEqual(reaction)
        expect(ReactionRepositoryMock.insert).toHaveBeenCalledWith('a', '1', 'LIKE')
    })
  }),
  describe('get reaction', () => {
    it('throws bad request exception because reaction is incorrect', async () => {
        await expect(service.getReactionByUserId('a', 'lie' as ReactionType)).rejects.toThrow('Bad Request')
        expect(ReactionRepositoryMock.getReactionByUserId).not.toHaveBeenCalled()
    }),
    it('returns reaction dto', async () => {
        const reaction = [new ReactionDTO({
            createdAt: new Date(),
            postId: '1',
            reaction: 'LIKE',
            userId: 'a'
        })]
        ReactionRepositoryMock.getReactionByUserId.mockResolvedValue(reaction)
        const result = await service.getReactionByUserId('a', 'LIKE')
        expect(result).toStrictEqual(reaction)
        expect(ReactionRepositoryMock.getReactionByUserId).toHaveBeenCalledWith('a', 'LIKE')
    })
  }),
  describe('deletes reaction', () => {
    it('deletes succesfully', async () => {
        service.deleteReaction('a', '1','LIKE')
        expect(ReactionRepositoryMock.delete).toHaveBeenCalledWith('a', '1','LIKE')
    })
  })
});
