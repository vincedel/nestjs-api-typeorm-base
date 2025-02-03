import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListResult } from 'src/common/dto/api-response.dto';
import { FilterQueryOptionsDto } from 'src/database/dto/filter-query-options.dto';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import * as bcryptUtils from '../../common/utils/bcrypt';
import { User } from '../../database/entities/user.entity';
import { DatabaseService } from '../../database/services/database.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService extends DatabaseService {
  constructor(
    dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(dataSource);
  }

  async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOneBy({ id: id });

    if (user) {
      return user;
    }

    return null;
  }

  async getUsers(
    queryOptions: FilterQueryOptionsDto,
  ): Promise<ListResult<User>> {
    const findOptions: FindManyOptions =
      this.getFindOptionsByQueryOptions<User>(queryOptions, User);

    const [entities, count] =
      await this.userRepository.findAndCount(findOptions);

    return {
      total: count,
      result: entities,
    };
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
