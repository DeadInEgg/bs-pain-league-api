import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Map } from './entities/map.entity';

@Injectable()
export class MapsService {
  constructor(
    @InjectRepository(Map)
    private mapRepository: Repository<Map>,
  ) {}

  findMaps(
    isActive?: boolean,
    isOnPowerLeagueSeason?: boolean,
    mode?: string,
  ): Promise<Map[]> {
    return this.mapRepository.find({
      relations: {
        mode: {
          type: true,
        },
      },
      where: {
        isActive,
        isOnPowerLeagueSeason,
        mode: {
          name: mode,
        },
      },
    });
  }
}
