import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOneBy({ id: id });

    if (user) {
      return user;
    }

    return null;
  }
}
