import { Injectable } from '@nestjs/common';
import { FighterDto } from './dto/fighter.dto';
import { Brawler } from '../brawler/entities/brawler.entity';
import { Repository } from 'typeorm';
import { ResourceNotFoundException } from '../../exceptions/ResourceNotFoundException';
import { InjectRepository } from '@nestjs/typeorm';
import { Fighter } from './entities/fighter.entity';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(Brawler)
    private brawlersRepository: Repository<Brawler>,
    @InjectRepository(Fighter)
    private fighterRepository: Repository<Fighter>,
  ) {}

  async create(fighterDto: FighterDto): Promise<Fighter> {
    const brawler = await this.brawlersRepository.findOneBy({
      id: fighterDto.brawlerId,
    });

    if (null === brawler) {
      throw new ResourceNotFoundException('Brawler not found');
    }

    return this.fighterRepository.create({
      ...fighterDto,
      brawler,
    });
  }
}
