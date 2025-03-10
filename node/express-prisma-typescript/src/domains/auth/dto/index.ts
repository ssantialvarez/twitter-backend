import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(25)
    username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(35)
    name: string  

  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword()
    password: string

  constructor (email: string, username: string, password: string, name: string) {
    this.email = email
    this.password = password
    this.username = username
    this.name = name
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
