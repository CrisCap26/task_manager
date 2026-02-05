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

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true, type: 'text' })
  comments?: string;

  @Column({ nullable: true })
  responsible?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  filePath?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ nullable: true })
  fileSize?: number;

  @Column({ nullable: true })
  fileMimeType?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
