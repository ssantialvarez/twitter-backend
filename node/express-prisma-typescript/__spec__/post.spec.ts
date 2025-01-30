import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { FollowerRepositoryMock } from '../__mocks__/FollowerRepositoryMock';
import { PostRepositoryMock } from '../__mocks__/PostRepositoryMock';
import { PostServiceImpl } from '../src/domains/post/service'
import { ExtendedPostDTO, PostDTO } from '../src/domains/post/dto';
import { UserViewDTO } from '../src/domains/user/dto';
import { deleteObjectByKey, generateKeyImage, generatePresignedUrl } from '../src/utils/s3'
import { validatesPostView } from '../src/utils/validation'

jest.mock('../src/utils/validation', () => ({
  validatesPostView: jest.fn()
}))
jest.mock('../src/utils/s3', () => ({
    deleteObjectByKey: jest.fn(),
    generatePresignedUrl: jest.fn(),
    generateKeyImage: jest.fn()
}));
const service = new PostServiceImpl(PostRepositoryMock)


describe('Post Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('get post', () => {
    it('returns found post because post user follows author', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: []})
        PostRepositoryMock.getById.mockResolvedValue(postToBeReturned)
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(true)
        
        const returnedPost = await service.getPost('b', '1')

        expect(returnedPost).toStrictEqual(postToBeReturned)
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(validatesPostMock).toHaveBeenCalledWith('b','a')
    }),
    it('returns found post because author is public', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: []})
        PostRepositoryMock.getById.mockResolvedValue(postToBeReturned)
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(true)
        
        const returnedPost = await service.getPost('b', '1')

        expect(returnedPost).toStrictEqual(postToBeReturned)
        expect(PostRepositoryMock.getById).toHaveBeenCalled()
        expect(validatesPostMock).toHaveBeenCalled()
    }),
    it('throws not found exception because post does not exist', async () => {
        PostRepositoryMock.getById.mockResolvedValue(null)
        const validatesPostMock = jest.mocked(validatesPostView)
        
        await expect(service.getPost('b', '1')).rejects.toThrow('Not found');
  
        expect(PostRepositoryMock.getById).toHaveBeenCalled()
        expect(validatesPostMock).not.toHaveBeenCalled()
      }),
    it('throws not found exception because author is private and requester does not follows', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: []})
        PostRepositoryMock.getById.mockResolvedValue(postToBeReturned)
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(false)
        
        await expect(service.getPost('b', '1')).rejects.toThrow('Not found');

        expect(PostRepositoryMock.getById).toHaveBeenCalled()
        expect(validatesPostMock).toHaveBeenCalled()
    })
  }),
  describe('delete post', () => {
    it('throws not found exception because post does not exist', async () => {
        const postToBeReturned = null
        PostRepositoryMock.getById.mockReturnValue(postToBeReturned)

        await expect(service.deletePost('a', '1')).rejects.toThrow('Not found');

        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(UserRepositoryMock.delete).not.toHaveBeenCalled()
    }),
    it('throws forbidden exception because user is not author', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: []})
        PostRepositoryMock.getById.mockReturnValue(postToBeReturned)
  
        await expect(service.deletePost('b', '1')).rejects.toThrow('Forbidden');
  
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(UserRepositoryMock.delete).not.toHaveBeenCalled()
    }),
    it('deletes correctly', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: ['hola.jpg']})
        const mockDeleteObjectByKey = jest.mocked(deleteObjectByKey);
        PostRepositoryMock.getById.mockReturnValue(postToBeReturned)

        await service.deletePost('a', '1')
                
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(mockDeleteObjectByKey).toHaveBeenCalledWith('hola.jpg')
        expect(PostRepositoryMock.delete).toHaveBeenCalledWith('1')
    })
  }),
  describe('create post', () => {
    it('creates and returns post and urls succesfully', async () => {
        let images = ['test.jpg']
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: ['test.jpg']})
        const mockGeneratePresignedUrl = jest.mocked(generatePresignedUrl);
        const mockGenerateKeyImage = jest.mocked(generateKeyImage);
        PostRepositoryMock.create.mockResolvedValue(postToBeReturned)
        mockGeneratePresignedUrl.mockResolvedValue('returnedPresignedUrl')
        mockGenerateKeyImage.mockResolvedValue('test.jpg')
        const result = await service.createPost('a', {content: 'tweet generico', images})

        expect(result.post).toStrictEqual(postToBeReturned)
        expect(result.urls).toContain('returnedPresignedUrl')
        expect(PostRepositoryMock.create).toHaveBeenCalled()
        expect(mockGeneratePresignedUrl).toHaveBeenCalledTimes(images.length)
    })
  }),
  describe('get posts by author', () => {
    it('returns found posts because user follows author', async () => {
        const author = new UserViewDTO({id:'a', name:'john doe', profilePicture: 'test.jpg', username: 'xmiliamx'})  
        const postsToBeReturned = [new ExtendedPostDTO({
            author,
            authorId: 'a',
            content: 'tweet generico',
            createdAt: new Date(),
            id: '1',
            images: ['test.jpg'],
            qtyComments: 0,
            qtyLikes: 0,
            qtyRetweets: 0
        })]
        PostRepositoryMock.getByAuthorId.mockResolvedValue(postsToBeReturned)
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(true)
        
        const returnedPosts = await service.getPostsByAuthor('b', 'a')

        expect(returnedPosts).toStrictEqual(postsToBeReturned)
        expect(PostRepositoryMock.getByAuthorId).toHaveBeenCalledWith('a')
        expect(validatesPostMock).toHaveBeenCalledWith('b','a')
    }),
    it('returns found post because author is public', async () => {
      const author = new UserViewDTO({id:'a', name:'john doe', profilePicture: 'test.jpg', username: 'xmiliamx'})  
      
      const postsToBeReturned = [new ExtendedPostDTO({
          author,
          authorId: 'a',
          content: 'tweet generico',
          createdAt: new Date(),
          id: '1',
          images: ['test.jpg'],
          qtyComments: 0,
          qtyLikes: 0,
          qtyRetweets: 0
        })]
        PostRepositoryMock.getByAuthorId.mockResolvedValue(postsToBeReturned)
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(true)
        
        const returnedPosts = await service.getPostsByAuthor('b', 'a')

        expect(returnedPosts).toStrictEqual(postsToBeReturned)
        expect(PostRepositoryMock.getByAuthorId).toHaveBeenCalled()
        expect(validatesPostMock).toHaveBeenCalled()
    })
    it('throws not found exception because author is private and requester does not follows', async () => {
        const validatesPostMock = jest.mocked(validatesPostView)
        validatesPostMock.mockResolvedValue(false)
      
        await expect(service.getPostsByAuthor('b','a')).rejects.toThrow('Not found');

        expect(PostRepositoryMock.getByAuthorId).not.toHaveBeenCalled()
        expect(validatesPostMock).toHaveBeenCalled()
    })
  }),
  describe('get users by username', () => { 
    it('gets users succesfully', async () => {
      await service.getLatestPosts('john', { limit: 5, before: 'a' })
        
      expect(PostRepositoryMock.getAllByDatePaginated).toHaveBeenCalledWith('john', { limit: 5, before: 'a'})
    })  
  })
});
