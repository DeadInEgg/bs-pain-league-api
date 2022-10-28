import { Tracker } from 'src/tracker/entities/tracker.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  mail: string;

  @Column()
  password: string;

  @OneToMany((type) => Tracker, (tracker) => tracker.id)
  trackers: Tracker[];
}
