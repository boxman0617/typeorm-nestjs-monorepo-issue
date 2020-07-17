import { Controller, Post } from '@nestjs/common';

@Controller('order')
export class OrderController {
  @Post('/')
  async createOrder() {}
}
