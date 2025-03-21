import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { FollowerRepositoryMock } from '../__mocks__/FollowerRepositoryMock';
import { UserServiceImpl } from '../src/domains/user/service'
import { ExtendedUserDTO, UserViewDTO } from '../src/domains/user/dto';
import { InternalServerErrorException } from '../src/utils/errors'
import { generateKeyImage, generatePresignedUrl } from '../src/utils/s3'

jest.mock('../src/utils/s3', () => ({
  generatePresignedUrl: jest.fn(),
  generateKeyImage: jest.fn()
}));
const service = new UserServiceImpl(UserRepositoryMock,FollowerRepositoryMock)

describe('User Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('get user', () => {
    it('returns the user', async () => {
      const user = new ExtendedUserDTO({
        createdAt: new Date(),
        email: 'email@email.com',
        id:'a',
        name: 'julian alvarez',
        password: 'password',
        profilePicture: 'test.jpg',
        public: true,
        username: 'juli',
        followers: [],
        following: []
      })
      const userToBeReturned = new UserViewDTO(user)
      UserRepositoryMock.getById.mockReturnValue(user)

      const returnedUser = await service.getUser('a')

      expect(UserRepositoryMock.getById).toHaveBeenCalledWith('a')
      expect(returnedUser).toStrictEqual(userToBeReturned)
    }),
    it('throws not found exception', async () => {
      UserRepositoryMock.getById.mockReturnValue(null)

      await expect(service.getUser('a')).rejects.toThrow('Not found');
      expect(UserRepositoryMock.getById).toHaveBeenCalled()
    })
  }),
  describe('check follow', () => {
    it('returns boolean', async () => {
      FollowerRepositoryMock.getFollowing.mockResolvedValue(true)

      const returnedUser = await service.checkFollow('a','b')

      expect(FollowerRepositoryMock.getFollowing).toHaveBeenCalledWith('a','b')
      expect(returnedUser).toBe(true)
    })
  }),
  describe('update user', () => { 
    it('updates succesfully', async () => {
      const user = new ExtendedUserDTO({
        createdAt: new Date(),
        email: 'email@email.com',
        id:'a',
        name: 'julian alvarez',
        password: 'password',
        profilePicture: 'test.jpg',
        public: true,
        username: 'juli',
        followers: [],
        following: []
      })
      
      const mockGeneratePresignedUrl = jest.mocked(generatePresignedUrl);
      const mockGenerateKeyImage = jest.mocked(generateKeyImage);
      UserRepositoryMock.update.mockResolvedValue(user)
    
      mockGeneratePresignedUrl.mockResolvedValue('returnedPresignedUrl')
      mockGenerateKeyImage.mockResolvedValue('test.jpg')
      const result = await service.updateUser('a', {email: 'notgmail@gmail.com', profilePicture: 'test.jpg'})
      
      expect(result.user).toStrictEqual(user)
      expect(result.url).toEqual('returnedPresignedUrl')
      expect(UserRepositoryMock.update).toHaveBeenCalled()
    }),
    it('updates succesfully', async () => {
      const user = new ExtendedUserDTO({
        createdAt: new Date(),
        email: 'email@email.com',
        id:'a',
        name: 'julian alvarez',
        password: 'password',
        profilePicture: 'test.jpg',
        public: true,
        username: 'juli',
        followers: [],
        following: []
      })
      
      const mockGeneratePresignedUrl = jest.mocked(generatePresignedUrl);
      const mockGenerateKeyImage = jest.mocked(generateKeyImage);
      UserRepositoryMock.update.mockResolvedValue(user)
    
      mockGeneratePresignedUrl.mockRejectedValue(new Error)
      mockGenerateKeyImage.mockResolvedValue('test.jpg')

      await expect(service.updateUser('a', {email: 'notgmail@gmail.com', profilePicture: 'test.jpg'})).rejects.toThrow('Internal')
      
      expect(UserRepositoryMock.update).not.toHaveBeenCalled()
    })  
  }),
  describe('delete user', () => { 
    it('deletes succesfully', async () => {
      await service.deleteUser('a')
      
      expect(UserRepositoryMock.delete).toHaveBeenCalledWith('a')
    }),
    it('deletes unsuccesfully', async () => {
      UserRepositoryMock.delete.mockRejectedValue(new InternalServerErrorException())

      await expect(service.deleteUser('a')).rejects.toThrow('Internal Server')
      
      expect(UserRepositoryMock.delete).toHaveBeenCalledWith('a')
    })  
  }),
  describe('check follow', () => { 
    it('checks if following', async () => {
      await service.checkFollow('a', 'b')
      
      expect(FollowerRepositoryMock.getFollowing).toHaveBeenCalledWith('a', 'b')
    })  
  }),
  describe('get users by username', () => { 
    it('gets users succesfully', async () => {
      await service.getUsersByUsername('john', { limit: 5, skip: 1 })
      UserRepositoryMock.getByUsername.mockResolvedValue(['john'])
      expect(UserRepositoryMock.getByUsername).toHaveBeenCalledWith('john', { limit: 5, skip: undefined })
    })  
  }),
  describe('get users recommendations', () => { 
    it('gets users succesfully', async () => {
      UserRepositoryMock.getRecommendedUsersPaginated.mockResolvedValue([new ExtendedUserDTO({
        createdAt: new Date(),
        email: "email@email.com",
        id: 'c',
        name: 'martin',
        password: 'palermo',
        profilePicture: 'test.jpg',
        public: false,
        username: 'marten',
        followers: [],
        following: []
      })])

      await service.getUserRecommendations('john', { limit: 5, skip: 1 })
      UserRepositoryMock.getRecommendedUsersPaginated.mockResolvedValue([])
      expect(UserRepositoryMock.getRecommendedUsersPaginated).toHaveBeenCalledWith('john', { limit: 5, skip: undefined })
    })  
  })
});

