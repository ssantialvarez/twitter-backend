import { UserViewDTO } from "@domains/user/dto"
import { FollowDTO } from "../dto"
export interface FollowerRepository {
    follow: (followerId: string, followedId: string) => Promise<void>
    unfollow: (followerId: string, followedId: string) => Promise<void>

    getFollowers: (followedId: string) => Promise<UserViewDTO[]>
    getFollowed: (followerId: string) => Promise<UserViewDTO[]>
    isFollowing: (followerId: string, followedId: string) => Promise<Boolean>
}
