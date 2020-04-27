import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  deletedAt: Date;
}
