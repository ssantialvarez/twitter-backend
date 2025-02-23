import { IsEmail, IsBoolean, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.profilePicture = user.profilePicture
    this.createdAt = user.createdAt
  }

  id: string
  name: string | null
  profilePicture: string | null
  createdAt: Date
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.username = user.username
    this.password = user.password
    this.public = user.public
    this.followers = user.followers
    this.following = user.following
  }
  followers!: string[]
  following!: string[]
  public!:boolean
  email!: string
  username!: string
  password!: string
}

export class UserViewDTO extends UserDTO {
  constructor (user: UserViewDTO) {
    super(user)
    this.username = user.username
  }
  username: string
}

export class UserProfileDTO extends UserViewDTO {
  constructor (user: UserProfileDTO) {
    super(user)
    this.followers = user.followers;
    this.following = user.following;
  }
  followers!: string[]
  following!: string[]
} 

export class UpdateInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
    email?: string

  @IsOptional()
  @IsString()
    username?: string

  @IsOptional()
  @IsString()
    name?: string

  @IsOptional()
  @IsString()
    profilePicture?: string

  @IsOptional()
  @IsBoolean()
    public?: boolean

  @IsOptional()
  @IsString()
  @IsStrongPassword()
    password?: string
}