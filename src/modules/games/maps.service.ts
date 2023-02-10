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

  async findMaps(): Promise<Map[]> {
    return await this.mapRepository.find({
      relations: {
        mode: {
          type: true,
        },
      },
    });
  }
}
