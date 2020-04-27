import { Entity, Column, PrimaryColumn } from 'typeorm';

import { Base } from './base';

@Entity()
export class PasswordResetRequests extends Base {
  @PrimaryColumn()
  email: string;

  @PrimaryColumn()
  code: string;

  @Column({
    default: true,
  })
  valid: boolean;
}
