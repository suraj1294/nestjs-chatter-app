import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + Number(this.configService.get('JWT_EXPIRATION')),
    );

    const token_payload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = await this.jwtService.signAsync(token_payload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  async logout(response: Response) {
    const expires = new Date();

    response.cookie('Authentication', '', {
      httpOnly: true,
      expires,
    });
  }
}
