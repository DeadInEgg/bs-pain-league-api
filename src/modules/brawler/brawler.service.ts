import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brawler } from './entities/brawler.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrawlerService {
  constructor(
    @InjectRepository(Brawler)
    private brawlerRepository: Repository<Brawler>,
  ) {}

  async findBrawlers(): Promise<Brawler[]> {
    return await this.brawlerRepository.find();
  }
}
