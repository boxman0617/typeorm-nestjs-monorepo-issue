import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';

export enum ContactType {
  email,
  phoneNumber,
}

@Entity()
export default class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: ContactType;

  @Column()
  value: string;

  @ManyToOne(
    () => Customer,
    customer => customer.contacts,
  )
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
