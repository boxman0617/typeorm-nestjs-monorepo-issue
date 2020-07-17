import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Contact from './contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  exports: [TypeOrmModule],
  providers: [ContactsService],
})
export class ContactsModule {}
