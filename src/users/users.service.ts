import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/database/PostgressCodes';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ONLINE_TIME } from './users.constants';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  getUsersByIds(users: string[]) {
    return this.userRepository.findByIds(users);
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new HttpException('This phone already used', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getUserById(userId: string) {
    return await this.userRepository.findOne(userId);
  }

  async getUserLastActive(userId: string): Promise<Date> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user.lastActive;
  }

  public async isUserOnline(userId: string): Promise<boolean> {
    const date = await this.getUserLastActive(userId);
    const dateNow = new Date();
    return true ? dateNow.getSeconds() - date.getSeconds() < ONLINE_TIME : false;
  }

  async updateUserLastActive(userId: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      user.lastActive = new Date();
      return await this.userRepository.save(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
