import { UserViewDTO } from "@domains/user/dto"

export interface FollowerService {
    followUser: (followerId: string, followedId: string) => Promise<void>
    unfollowUser: (followerId: string, followedId: string) => Promise<void>
    getFollowersById: (followedId: string) => Promise<UserViewDTO[]>
    getFollowedById: (followerId: string) => Promise<UserViewDTO[]>

    isFollowing: (followerId: string, followedId: string) => Promise<Boolean>
}
