import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 64, nullable: false, unique: true })
  username: string;

  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @Column({ length: 32, nullable: true })
  firstName: string;

  @Column({ length: 32, nullable: true })
  lastName: string;

  @Column({ length: 72, nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.User })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
