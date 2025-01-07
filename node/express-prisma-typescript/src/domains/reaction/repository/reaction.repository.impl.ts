import { PrismaClient } from '@prisma/client'
import { ReactionRepository } from './reaction.repository';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  
}
