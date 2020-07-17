import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CUSTOMER_DIRECTORY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'customerDirectory',
          protoPath: path.resolve(
            __dirname,
            '../../../proto/customer-directory.proto',
          ),
        },
      },
    ]),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
