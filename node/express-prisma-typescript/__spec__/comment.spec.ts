
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { FollowerRepositoryMock } from '../__mocks__/FollowerRepositoryMock';
import { CommentRepositoryMock } from '../__mocks__/CommentRepositoryMock';
import { PostRepositoryMock } from '../__mocks__/PostRepositoryMock';
import { CommentServiceImpl } from '../src/domains/comment/service'
import { ExtendedPostDTO, PostDTO } from '../src/domains/post/dto';
import { UserViewDTO } from '../src/domains/user/dto';
import { deleteObjectByKey, generateKeyImage, generatePresignedUrl } from '../src/utils/s3'

jest.mock('../src/utils/s3', () => ({
    deleteObjectByKey: jest.fn(),
    generatePresignedUrl: jest.fn(),
    generateKeyImage: jest.fn()
}));
const service = new CommentServiceImpl(CommentRepositoryMock,FollowerRepositoryMock,UserRepositoryMock,PostRepositoryMock)

describe('Comment Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create commment', () => {
    it('throws not found because parent post does not exist', async () => {
        PostRepositoryMock.getById.mockResolvedValue(null)

        await expect(service.createComment('a','1',{content: 'tweet'})).rejects.toThrow('Not found')
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
    }),
    it('throws not found because parent post is private and user does not follow', async () => {
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: []})
        PostRepositoryMock.getById.mockResolvedValue(postToBeReturned)
        UserRepositoryMock.isPublic.mockResolvedValue(false)
        FollowerRepositoryMock.isFollowing.mockResolvedValue(false)


,
        await expect(service.createComment('b','1',{content: 'tweet'})).rejects.toThrow('Not found')
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(UserRepositoryMock.isPublic).toHaveBeenCalledWith('a')
        expect(FollowerRepositoryMock.isFollowing).toHaveBeenCalledWith('b','a')
    }),
    it('creates and returns post and urls succesfully', async () => {
        let images = ['test.jpg']
        const postToBeReturned = new PostDTO({authorId:'a',content:'tweet generico', id:'1', createdAt: new Date(), images: ['test.jpg']})
        const commentToBeReturned = new PostDTO({authorId:'b',content:'respuesta', id:'2', createdAt: new Date(), images: ['test.jpg']})
        const mockGeneratePresignedUrl = jest.mocked(generatePresignedUrl);
        const mockGenerateKeyImage = jest.mocked(generateKeyImage);

        PostRepositoryMock.getById.mockResolvedValue(postToBeReturned)
        UserRepositoryMock.isPublic.mockResolvedValue(true)
        CommentRepositoryMock.create.mockResolvedValue(commentToBeReturned)
        mockGeneratePresignedUrl.mockResolvedValue('returnedPresignedUrl')
        mockGenerateKeyImage.mockResolvedValue('test.jpg')
        
        const result = await service.createComment('b', '1', {content: 'respuesta', images})

        expect(result.comment).toStrictEqual(commentToBeReturned)
        expect(result.urls).toContain('returnedPresignedUrl')
        expect(PostRepositoryMock.getById).toHaveBeenCalledWith('1')
        expect(UserRepositoryMock.isPublic).toHaveBeenCalledWith('a')
        expect(FollowerRepositoryMock.isFollowing).not.toHaveBeenCalled()
        expect(CommentRepositoryMock.create).toHaveBeenCalledWith('b', '1', {content: 'respuesta', images})
        expect(mockGeneratePresignedUrl).toHaveBeenCalledTimes(images.length)
        expect(mockGenerateKeyImage).toHaveBeenCalled()
    })
  })
});