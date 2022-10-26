import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackersRepository: Repository<Tracker>,
    private userService: UserService,
  ) {}

  async create(createTrackerDto: CreateTrackerDto) {
    const tracker = new Tracker();
    tracker.name = createTrackerDto.name;

    const user = await this.userService.findOne(createTrackerDto.userId);
    tracker.user = user;

    return this.trackersRepository.save(tracker);
  }

  findAll(): Promise<Tracker[]> {
    return this.trackersRepository.find();
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
