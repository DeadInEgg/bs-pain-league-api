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
    createUserDto.password = this.encryptPassword(createUserDto.password);
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByMail(mail: string): Promise<User> {
    return await this.usersRepository.findOneBy({ mail });
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async updatePassword(user: User, newPassword: string): Promise<User> {
    user.password = this.encryptPassword(newPassword);
    return await this.usersRepository.save(user);
  }

  async remove(user: User): Promise<User> {
    return await this.usersRepository.remove(user);
  }

  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async comparePassword(
    password1: string,
    password2: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password1, password2);
  }
}
