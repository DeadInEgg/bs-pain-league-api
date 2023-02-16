import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mode } from './mode.entity';

@Entity()
export class Map {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => Mode)
  @JoinColumn({ name: 'mode_id' })
  mode: Mode;
}
