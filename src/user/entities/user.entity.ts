import { Todo } from '../../todo/entitites/todo.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  @JoinColumn({
    name: 'user_id',
  })
  todos: Todo[];
}
