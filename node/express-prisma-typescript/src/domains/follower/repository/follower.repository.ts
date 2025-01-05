
export interface FollowerRepository {
    follow: (followerId: string, followedId: string) => Promise<void>
    unfollow: (followerId: string, followedId: string) => Promise<void>
}
