import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tag: string;

  @Column()
  hash: string;

  @ManyToOne((type) => User, (user) => user.id)
  user: User;
}
