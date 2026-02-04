import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class TaskOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ nullable: true })
  responsible?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
