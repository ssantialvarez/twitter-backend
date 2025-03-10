import { UserRepository } from '@domains/user/repository'
import {
  checkPassword,
  ConflictException,
  encryptPassword,
  generateAccessToken,
  NotFoundException,
  UnauthorizedException
} from '@utils'

import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto'
import { AuthService } from './auth.service'
import { UserDTO } from '@domains/user/dto'

export class AuthServiceImpl implements AuthService {
  constructor (private readonly repository: UserRepository) {}

  async signup (data: SignupInputDTO): Promise<TokenDTO> {
    const existingUser = await this.repository.getByEmailOrUsername(data.email, data.username)
    if (existingUser) throw new ConflictException(`${(existingUser.email === data.email) ? 'EMAIL_' : ''}${(existingUser.username === data.username) ? 'USERNAME_' : ''}ALREADY_EXISTS`)

    const encryptedPassword = await encryptPassword(data.password)

    const user = await this.repository.create({ ...data, password: encryptedPassword })
    const token = generateAccessToken({ userId: user.id })

    return { token }
  }

  async login (data: LoginInputDTO): Promise<TokenDTO> {
    const user = await this.repository.getByEmailOrUsername(data.email, data.username)
    if (!user) throw new NotFoundException('user')

    const isCorrectPassword = await checkPassword(data.password, user.password)

    if (!isCorrectPassword) throw new UnauthorizedException('INCORRECT_PASSWORD')

    const token = generateAccessToken({ userId: user.id })

    return { token }
  }

  async getUserByEmailOrUsername (data: string): Promise<UserDTO>{
    const user = await this.repository.getByEmailOrUsername(data, data);
    if(!user) throw new NotFoundException('user')
    return new UserDTO(user)
  }
}
