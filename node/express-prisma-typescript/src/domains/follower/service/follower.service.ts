import { FollowDTO } from '../dto'

export interface FollowerService {
    followUser: (followerId: string, followedId: string) => Promise<void>
    unfollowUser: (followerId: string, followedId: string) => Promise<void>
}
