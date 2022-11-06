import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(mail: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByMail(mail);
    const match = await bcrypt.compare(password, user?.password);

    if (match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { id: user.id, mail: user.mail, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
