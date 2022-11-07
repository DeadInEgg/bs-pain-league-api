import { Tracker } from 'src/modules/trackers/entities/tracker.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Map } from './map.entity';
import { Mode } from './mode.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: string;

  @ManyToOne(() => Map, (map) => map.id)
  map: Map;

  @ManyToOne(() => Mode, (mode) => mode.id)
  mode: Mode;

  @ManyToOne(() => Tracker, (tracker) => tracker.id, {
    onDelete: 'CASCADE',
  })
  tracker: Tracker;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
