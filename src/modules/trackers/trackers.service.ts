import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
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

  async create(
    createTrackerDto: CreateTrackerDto,
    user: User,
  ): Promise<Tracker> {
    const tracker = await this.trackersRepository.create({
      ...createTrackerDto,
      user,
    });

    return this.trackersRepository.save(tracker);
  }

  async findByUserId(id: number): Promise<Tracker[]> {
    return this.trackersRepository.findBy({
      user: {
        id,
      },
    });
  }

  async findOneByHashAndUserIdWithGames(
    hash: string,
    userId: number,
  ): Promise<Tracker> {
    return this.trackersRepository.findOne({
      where: {
        hash,
        user: {
          id: userId,
        },
      },
      relations: {
        games: {
          map: {
            mode: true,
          },
        },
      },
    });
  }

  async findOneByHashAndUserId(
    hash: string,
    userId: number,
  ): Promise<Tracker | null> {
    return this.trackersRepository.findOne({
      where: {
        hash,
        user: {
          id: userId,
        },
      },
    });
  }

  async update(
    tracker: Tracker,
    updateTrackerDto: UpdateTrackerDto,
  ): Promise<Tracker> {
    return this.trackersRepository.save({
      ...tracker,
      ...updateTrackerDto,
    });
  }

  async remove(tracker: Tracker): Promise<Tracker> {
    return this.trackersRepository.remove(tracker);
  }
}
