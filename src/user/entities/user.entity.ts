import { Tracker } from 'src/tracker/entities/tracker.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @OneToMany((type) => Tracker, (tracker) => tracker.id)
  trackers: Tracker[];
}
