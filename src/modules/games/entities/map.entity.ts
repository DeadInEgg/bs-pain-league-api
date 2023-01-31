import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mode } from './mode.entity';

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  image?: string;

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
