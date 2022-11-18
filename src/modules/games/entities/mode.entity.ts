import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Type } from './type.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Mode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Type)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @ApiHideProperty()
  @OneToMany(() => Game, (game) => game.mode)
  games: Game[];
}
