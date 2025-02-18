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
  }
  public!:boolean
  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
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