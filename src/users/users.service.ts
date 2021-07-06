import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/database/PostgressCodes';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserActiveDto } from './dto/user-active.dtc';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getUsersByIds(users: string[]) {
    return this.userRepository.findByIds(users);
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'This phone already used',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getUserById(userId: string) {
    return await this.userRepository.findOne(userId);
  }

  async getUserLastActive(userId: string) {
    try {
      const user = this.userRepository.findOneOrFail({ where: { id: userId } });
      return { lastActive: (await user).lastActive } as UserActiveDto;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUserLastActive(userId: string) {
    try {
      return await this.userRepository.update(userId, {
        lastActive: new Date(),
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
