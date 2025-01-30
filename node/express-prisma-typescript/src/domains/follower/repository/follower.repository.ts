import { UserViewDTO } from "@domains/user/dto"
import { FollowDTO } from "../dto"
export interface FollowerRepository {
    follow: (followerId: string, followedId: string) => Promise<FollowDTO>
    unfollow: (followerId: string, followedId: string) => Promise<FollowDTO[]>

    getFollowers: (followedId: string) => Promise<UserViewDTO[]>
    getFollowed: (followerId: string) => Promise<UserViewDTO[]>
    getFollowing: (followerId: string, followedId: string) => Promise<Boolean>
}
