import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDTO } from './customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  create({ name }: CreateCustomerDTO): Promise<Customer> {
    return this.customersRepository.save(
      this.customersRepository.create({
        name,
      }),
    );
  }
}
