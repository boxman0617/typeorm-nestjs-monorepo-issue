import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Address from './address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  exports: [TypeOrmModule],
  providers: [AddressesService],
})
export class AddressesModule {}
