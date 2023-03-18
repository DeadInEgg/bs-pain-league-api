import { Tracker } from '../../trackers/entities/tracker.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Map } from './map.entity';
import { Mode } from './mode.entity';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Fighter } from './fighter.entity';

export enum GameResult {
  VICTORY = 'victory',
  DRAW = 'draw',
  DEFEAT = 'defeat',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: GameResult,
  })
  result: GameResult;

  @ManyToOne(() => Map)
  @JoinColumn({ name: 'map_id' })
  map: Map;

  @ManyToOne(() => Mode, (mode) => mode.games, {
    nullable: false,
  })
  @JoinColumn({ name: 'mode_id' })
  mode: Mode;

  @ApiHideProperty()
  @ManyToOne(() => Tracker, (tracker) => tracker.games, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tracker_id' })
  tracker: Tracker;

  @ApiPropertyOptional()
  @OneToMany(() => Fighter, (fighter) => fighter.game, {
    nullable: true,
  })
  fighters: Fighter[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
