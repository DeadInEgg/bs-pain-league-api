import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FighterDto } from './dto/fighter.dto';
import { Brawler } from '../brawler/entities/brawler.entity';
import { Repository } from 'typeorm';
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
      throw new HttpException('Brawler not found', HttpStatus.NOT_FOUND);
    }

    return this.fighterRepository.create({
      ...fighterDto,
      brawler,
    });
  }

  async remove(fighters: Fighter[]): Promise<Fighter[]> {
    return this.fighterRepository.remove(fighters);
  }
}
