import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Game } from '../..//games/entities/game.entity';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /**
   * Player's id in brawl star app
   */
  @Column({ nullable: true })
  tag?: string;

  @Column()
  @Generated('uuid')
  hash: string;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => User, (user) => user.trackers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Game, (game) => game.tracker)
  games: Game[];

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

  constructor(partial: Partial<Tracker>) {
    Object.assign(this, partial);
  }
}
