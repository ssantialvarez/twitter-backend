import { FollowerServiceImpl } from '../src/domains/follower/service'
import { FollowerRepositoryMock } from '../__mocks__/FollowerRepositoryMock';
import { FollowDTO } from '../src/domains/follower/dto';
import { UserViewDTO } from '../src/domains/user/dto'
jest.mock('../src/utils/socketio.ts', () => ({}));

const service = new FollowerServiceImpl(FollowerRepositoryMock)

describe('Follower Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('follow user', () => {
    it('throws conflict exception because self following', async () => {
        await expect(service.followUser('a','a')).rejects.toThrow('Conflict')
    }),
    it('follows succesfully', async () => {
        const returnedFollow = new FollowDTO({createdAt: new Date(), followedId: 'a', followerId: 'b'})
        FollowerRepositoryMock.follow.mockResolvedValue(returnedFollow)
        const result = await service.followUser('b', 'a')

        expect(FollowerRepositoryMock.follow).toHaveBeenCalledWith('b', 'a')
        expect(result).toStrictEqual(returnedFollow)
    })
  }),
  describe('unfollow user', () => {
    it('unfollows', async () => {
      FollowerRepositoryMock.unfollow.mockResolvedValue([new FollowDTO({createdAt: new Date(), followedId: 'a', followerId: 'b'})])
      await service.unfollowUser('b', 'a')
      expect(FollowerRepositoryMock.unfollow).toHaveBeenCalledWith('b', 'a')
    }),
    it('unfollows', async () => {
      FollowerRepositoryMock.unfollow.mockResolvedValue([])
      await expect(service.unfollowUser('b', 'a')).rejects.toThrow('Not found')
      expect(FollowerRepositoryMock.unfollow).toHaveBeenCalledWith('b', 'a')
    })
  }),
  describe('is following user', () => {
    it('is following', async () => {
      
      await service.isFollowing('b', 'a')
      expect(FollowerRepositoryMock.getFollowing).toHaveBeenCalledWith('b', 'a')
    })
  }),
  describe('gets followers', () => {
    it('returns followers', async () => {
      const followers = [new UserViewDTO({
        id: 'b',
        name: 'julian',
        profilePicture: 'test.jpg',
        username: 'juli',
        public: true,
        createdAt: new Date()
      })]

      FollowerRepositoryMock.getFollowers.mockResolvedValue(followers)

      const result = await service.getFollowersById('a')
      
      expect(FollowerRepositoryMock.getFollowers).toHaveBeenCalledWith('a')
      expect(result).toStrictEqual(followers)
    })
  }),
  describe('gets followed', () => {
    it('returns followed', async () => {
      const followed = [new UserViewDTO({
        id: 'b',
        name: 'julian',
        profilePicture: 'test.jpg',
        username: 'juli',
        public: true,
        createdAt: new Date()
      })]

      FollowerRepositoryMock.getFollowed.mockResolvedValue(followed)

      const result = await service.getFollowedById('a')
      
      expect(FollowerRepositoryMock.getFollowed).toHaveBeenCalledWith('a')
      expect(result).toStrictEqual(followed)
    })
  })
});
