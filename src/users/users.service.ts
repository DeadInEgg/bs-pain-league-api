import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.mail = createUserDto.mail;
    const hash = bcrypt.hashSync(createUserDto.password, 10);
    user.password = hash;

    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  findByMail(mail: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ mail });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.mail) user.mail = updateUserDto.mail;
    if (updateUserDto.password) user.password = updateUserDto.password;
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
