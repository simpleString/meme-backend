import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  registration(createUserDto: CreateUserDto) {}

  login() {}

  generateAccessToken() {}

  generateRefreshToken() {
    const token = this.tokenRepository.create();
    this.tokenRepository.save(token);
  }
}
