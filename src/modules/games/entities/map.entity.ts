import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Mode } from './mode.entity';
import {Expose} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Game, (game) => game.map)
  games: Game[];

  @ManyToMany(() => Mode, (mode) => mode.id)
  @JoinTable({
    name: 'maps_modes',
    joinColumn: {
      name: 'map_id',
    },
    inverseJoinColumn: {
      name: 'mode_id',
    },
  })
  modes: Mode[];
}
