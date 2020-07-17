import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Contact from '../contacts/contact.entity';
import Address from '../addresses/address.entity';
import Note from '../notes/note.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => Contact,
    contact => contact.customer,
  )
  contacts: Contact[];

  @OneToMany(
    () => Address,
    address => address.customer,
  )
  address: Address[];

  @OneToMany(
    () => Note,
    note => note.customer,
  )
  note: Note[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
