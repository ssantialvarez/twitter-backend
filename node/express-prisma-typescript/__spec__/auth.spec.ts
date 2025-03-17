import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { AuthServiceImpl } from '../src/domains/auth/service'
import { checkPassword, generateAccessToken, encryptPassword } from '../src/utils/auth'
import { ExtendedUserDTO, UserDTO } from '../src/domains/user/dto';

jest.mock('../src/utils/auth', () => ({
  generateAccessToken: jest.fn(),
  encryptPassword: jest.fn(),
  checkPassword: jest.fn()
}));

const service = new AuthServiceImpl(UserRepositoryMock)

describe('Auth Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('signup', () => {
    it('returns the user', async () => {
        const user = new UserDTO({
            createdAt: new Date(),
            id:'a',
            name: 'julian alvarez',
            profilePicture: 'test.jpg',
            public: true
        })
        const mockGenerateAccessToken = jest.mocked(generateAccessToken);
        const mockEncryptPassword = jest.mocked(encryptPassword);
        
        mockEncryptPassword.mockResolvedValue('password')
        mockGenerateAccessToken.mockReturnValue('token')
        UserRepositoryMock.getByEmailOrUsername.mockResolvedValue(null)
        UserRepositoryMock.create.mockResolvedValue(user)
        const returnedToken = await service.signup({email:"email@email.com", password: 'password', username: 'juli', name: "julian"})
        
        expect(UserRepositoryMock.getByEmailOrUsername).toHaveBeenCalledWith("email@email.com", 'juli')
        expect(mockEncryptPassword).toHaveBeenCalledWith('password')
        expect(UserRepositoryMock.create).toHaveBeenCalled()
        expect(mockGenerateAccessToken).toHaveBeenCalledWith({"userId": "a"})
        expect(returnedToken.token).toEqual('token')
    }),
    it('throws conflict exception', async () => {
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
    
        UserRepositoryMock.getByEmailOrUsername.mockResolvedValue(user)


        await expect(service.signup({email:"email@email.com", password: 'password', username: 'juli', name: "julian"})).rejects.toThrow('Conflict')
        expect(UserRepositoryMock.getByEmailOrUsername).toHaveBeenCalledWith("email@email.com", 'juli')
    })
  }),
  describe('login', () => {
    it('returns token succesfully', async () => {
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
        const mockCheckPassword = jest.mocked(checkPassword);
        const mockGenerateAccessToken = jest.mocked(generateAccessToken)

        UserRepositoryMock.getByEmailOrUsername.mockResolvedValue(user)        
        mockCheckPassword.mockResolvedValue(true)
        mockGenerateAccessToken.mockReturnValue('token')
        
        const token = await service.login({email:"email@email.com", password: 'notPassword'})
        
        expect(UserRepositoryMock.getByEmailOrUsername).toHaveBeenCalledWith("email@email.com", undefined)
        expect(mockCheckPassword).toHaveBeenCalledWith('notPassword', 'password')
        expect(mockGenerateAccessToken).toHaveBeenCalledWith({userId: 'a'})
        expect(token.token).toStrictEqual('token')
    }),
    it('throws unauthorized exception', async () => {
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
        const mockCheckPassword = jest.mocked(checkPassword);
        
        
        mockCheckPassword.mockResolvedValue(false)
        UserRepositoryMock.getByEmailOrUsername.mockResolvedValue(user)
        
        
        await expect(service.login({email:"email@email.com", password: 'notPassword'})).rejects.toThrow('Unauthorized')
        
        expect(UserRepositoryMock.getByEmailOrUsername).toHaveBeenCalledWith("email@email.com", undefined)
        expect(mockCheckPassword).toHaveBeenCalledWith('notPassword', 'password')
    }),
    it('throws not found exception', async () => {
        UserRepositoryMock.getByEmailOrUsername.mockResolvedValue(null)

        await expect(service.login({email:"email@email.com", password: 'password', username: 'juli'})).rejects.toThrow('Not found')
        expect(UserRepositoryMock.getByEmailOrUsername).toHaveBeenCalledWith("email@email.com", 'juli')
    })
  })
});
