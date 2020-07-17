import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ContactsModule } from './contacts/contacts.module';
import { AddressesModule } from './addresses/addresses.module';
import { NotesModule } from './notes/notes.module';
import { CustomersService } from './customers/customers.service';
import { Customer } from './customers/customer.entity';
import Address from './addresses/address.entity';
import Note from './notes/note.entity';
import Contact from './contacts/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ContactsModule,
    AddressesModule,
    NotesModule,
    CustomersModule,
    TypeOrmModule.forRoot({
      entities: [Customer, Contact, Address, Note],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CustomersService],
})
export class AppModule {}
