import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';

@Injectable()
export class TrackersService {
  constructor(
    @InjectRepository(Tracker)
    private trackersRepository: Repository<Tracker>,
  ) {}

  async create(createTrackerDto: CreateTrackerDto, user: User) {
    const tracker = this.trackersRepository.create({
      ...createTrackerDto,
      user,
    });
    return this.trackersRepository.save(tracker);
  }

  async findOneById(id: number): Promise<Tracker> {
    return await this.trackersRepository.findOneBy({ id });
  }

  async findByUserId(id: number): Promise<Tracker[]> {
    return await this.trackersRepository.findBy({
      user: {
        id: id,
      },
    });
  }

  async findOnByHash(hash: string): Promise<Tracker> {
    return await this.trackersRepository.findOneBy({ hash });
  }

  async update(
    hash: string,
    updateTrackerDto: UpdateTrackerDto,
  ): Promise<Tracker> {
    const tracker = await this.findOnByHash(hash);
    if (!tracker)
      throw new HttpException(
        'Tracker not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return await this.trackersRepository.save({
      ...tracker,
      ...updateTrackerDto,
    });
  }

  async remove(hash: string): Promise<Tracker> {
    const tracker = await this.findOnByHash(hash);
    return await this.trackersRepository.remove(tracker);
  }
}
