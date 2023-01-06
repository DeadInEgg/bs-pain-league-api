import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mode } from './mode.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ApiHideProperty()
  @OneToMany(() => Mode, (mode) => mode.games)
  modes: Mode[];
}
