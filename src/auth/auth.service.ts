import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

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

  verify(request: Request): TokenPayload {
    const cookies: string[] = request.headers.cookie?.split('; ');
    const authCookie = cookies.find((cookie) =>
      cookie.includes('Authentication'),
    );

    const jwt = authCookie.split('Authentication=')[1];

    return this.jwtService.verify(jwt);
  }

  async logout(response: Response) {
    const expires = new Date();

    response.cookie('Authentication', '', {
      httpOnly: true,
      expires,
    });
  }
}
