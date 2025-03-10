import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ExtendedUserDTO, UserViewDTO } from '@domains/user/dto'
import { ReactionDTO } from '@domains/reaction/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @IsString({ each: true})
    images?: string[]   
}

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = post.author
    this.parentPostId = post.parentPostId
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
    this.reactions = post.reactions
  }

  reactions: ReactionDTO[]
  parentPostId: string | null
  author!: UserViewDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
}
