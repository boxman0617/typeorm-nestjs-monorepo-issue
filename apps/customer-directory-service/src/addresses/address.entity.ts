import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity()
export default class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Customer,
    customer => customer.contacts,
  )
  customer: Customer;

  @Column()
  line: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
