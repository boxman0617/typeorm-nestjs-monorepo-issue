import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Note from './note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  exports: [TypeOrmModule],
  providers: [NotesService],
})
export class NotesModule {}
