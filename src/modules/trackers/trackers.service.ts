import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
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
        id
      },
    });
  }

  async findOneByHashAndUserIdWithGames(hash: string, userId: number): Promise<Tracker> {
    return await this.trackersRepository.findOne({
      where: {
        hash,
        user: {
          id: userId
        }
      },
      relations: {
        games: {
          mode: true,
          map: true,
        }
      }
    });
  }

  async findOneByHashAndUser(hash: string, userId: number): Promise<Tracker> {
    return await this.trackersRepository.findOne({
      where: {
        hash,
        user: {
          id: userId
        }
      }
    });
  }

  async update(
    tracker: Tracker,
    updateTrackerDto: UpdateTrackerDto,
  ): Promise<Tracker> {
    return await this.trackersRepository.save({
      ...tracker,
      ...updateTrackerDto,
    });
  }

  async remove(tracker: Tracker): Promise<Tracker> {
    return await this.trackersRepository.remove(tracker);
  }
}
