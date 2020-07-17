import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateCustomerDTO,
  CreatedCustomerMessageDTO,
} from './customers/customers.dto';
import { CustomersService } from './customers/customers.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly customersService: CustomersService,
  ) {}

  @GrpcMethod('CustomerDirectoryService')
  async createCustomer(
    dto: CreateCustomerDTO,
  ): Promise<CreatedCustomerMessageDTO> {
    const createdCustomer = await this.customersService.create(dto);

    return {
      ...createdCustomer,
      createdAt: createdCustomer.createdAt.toISOString(),
      updatedAt: createdCustomer.updatedAt.toISOString(),
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
