import { UserViewDTO } from "@domains/user/dto"
import { FollowDTO } from "../dto"


export interface FollowerService {
    followUser: (followerId: string, followedId: string) => Promise<FollowDTO>
    unfollowUser: (followerId: string, followedId: string) => Promise<FollowDTO>
    getFollowersById: (followedId: string) => Promise<UserViewDTO[]>
    getFollowedById: (followerId: string) => Promise<UserViewDTO[]>

    isFollowing: (followerId: string, followedId: string) => Promise<Boolean>
}
