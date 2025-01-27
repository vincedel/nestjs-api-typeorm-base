import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcryptUtils from '../../common/utils/bcrypt';

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

  async getUsersByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    });

    if (user) {
      return user;
    }

    return null;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    userDto.password = bcryptUtils.encodePassword(userDto.password);

    const user: User = this.userRepository.create({
      username: userDto.username,
      email: userDto.email,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      password: userDto.password,
      role: userDto.role,
    });

    return await this.userRepository.save(user);
  }
}
