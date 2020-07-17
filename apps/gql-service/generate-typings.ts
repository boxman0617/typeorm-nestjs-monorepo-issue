import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
(async () => {
  await definitionsFactory.generate({
    typePaths: ['./src/**/*.graphql'],
    path: join(process.cwd(), 'src/graphql.schema.ts'),
    outputAs: 'class',
  });
})();
