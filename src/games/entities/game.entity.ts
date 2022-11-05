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

  @Column({ type: 'boolean' })
  win: boolean;

  @Column({ type: 'boolean' })
  loose: boolean;

  @ManyToOne(() => Map, (map) => map.id)
  map: Map;

  @ManyToOne(() => Mode, (mode) => mode.id)
  mode: Mode;

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
