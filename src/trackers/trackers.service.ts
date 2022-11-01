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

  async create(createTrackerDto: CreateTrackerDto, user?: User) {
    const tracker = new Tracker();
    tracker.name = createTrackerDto.name;
    if (tracker.tag) tracker.tag = createTrackerDto.tag;
    if (user) {
      tracker.user = user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.trackersRepository.save(tracker);
  }

  async findOne(id: number): Promise<Tracker> {
    return await this.trackersRepository.findOneBy({ id });
  }

  async findByUserId(id: number): Promise<Tracker[]> {
    return await this.trackersRepository.findBy({
      user: {
        id: id,
      },
    });
  }

  async findByHash(hash: string): Promise<Tracker> {
    return await this.trackersRepository.findOneBy({ hash });
  }

  async update(
    hash: string,
    updateTrackerDto: UpdateTrackerDto,
  ): Promise<Tracker> {
    const tracker = await this.findByHash(hash);
    if (updateTrackerDto.name) tracker.name = updateTrackerDto.name;
    if (updateTrackerDto.tag) tracker.tag = updateTrackerDto.tag;
    return await this.trackersRepository.save(tracker);
  }

  async remove(hash: string): Promise<void> {
    const tracker = await this.findByHash(hash);
    await this.trackersRepository.delete(tracker.id);
  }
}
