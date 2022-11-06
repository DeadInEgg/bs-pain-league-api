import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Type } from './type.entity';

@Entity()
export class Mode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Type, (type) => type.id)
  type: Type;

  @OneToMany(() => Game, (game) => game.id)
  games: Game[];
}
