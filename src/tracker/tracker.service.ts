import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackersRepository: Repository<Tracker>,
  ) {}

  async create(createTrackerDto: CreateTrackerDto, user?: User) {
    const tracker = new Tracker();
    tracker.name = createTrackerDto.name;
    if (user) tracker.user = user;
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
    id: number,
    updateTrackerDto: UpdateTrackerDto,
  ): Promise<Tracker> {
    const tracker = await this.findOne(id);
    const updated = { ...tracker, ...updateTrackerDto };

    return await this.trackersRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    await this.trackersRepository.delete(id);
  }
}
