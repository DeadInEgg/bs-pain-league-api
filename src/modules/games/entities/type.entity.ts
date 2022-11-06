import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mode } from './mode.entity';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Mode, (mode) => mode.id)
  games: Mode[];
}
