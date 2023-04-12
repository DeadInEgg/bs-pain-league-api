import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mode } from './entities/mode.entity';

@Injectable()
export class ModesService {
  constructor(
    @InjectRepository(Mode)
    private modeRepository: Repository<Mode>,
  ) {}

  async findModes(isActive?: boolean, type?: string): Promise<Mode[]> {
    return this.modeRepository.find({
      where: {
        isActive,
        type: {
          name: type,
        },
      },
    });
  }
}
