export const FollowerRepositoryMock = {
    follow: jest.fn(),
    unfollow: jest.fn(),

    getFollowers: jest.fn(),
    getFollowed: jest.fn(),
    isFollowing: jest.fn()
}