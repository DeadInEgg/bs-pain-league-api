import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Brawler } from '../../brawler/entities/brawler.entity';

@Entity()
export class Fighter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  opponent: boolean;

  @Column()
  me: boolean;

  @ManyToOne(() => Game, (game) => game.fighters)
  game: Game;

  @ManyToOne(() => Brawler)
  brawler: Brawler;

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
