import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:3000`,
        package: 'customerDirectory',
        protoPath: path.join(
          __dirname,
          '../../../proto/customer-directory.proto',
        ),
      },
    },
  );
  await app.listen(() => console.log('Customer Directory Service gRPC is up!'));
})();
