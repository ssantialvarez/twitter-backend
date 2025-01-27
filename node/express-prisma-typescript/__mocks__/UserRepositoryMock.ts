export const UserRepositoryMock = {
    create: jest.fn(),
    delete: jest.fn(),
    getRecommendedUsersPaginated: jest.fn(),
    getById: jest.fn(),
    getByEmailOrUsername: jest.fn(),
    
    getByUsername: jest.fn(),
    
    isPublic: jest.fn(),
    update: jest.fn()
}