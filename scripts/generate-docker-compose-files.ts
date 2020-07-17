import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'json2yaml';

const DOCKER_COMPOSE_FILE_VERSION = '3.8';
const ROOT_DIR = path.resolve(__dirname, '../');
const DOCKER_COMPOSE_FILE = `${ROOT_DIR}/docker-compose.yml`;
const DOCKER_COMPOSE_OVERRIDE_FILE = `${ROOT_DIR}/docker-compose.override.yml`;
let currentPort = 3000;

const generateNextPort = () => {
  const port = currentPort;
  currentPort += 1;
  return port;
};

const generateService = (
  serviceName: string,
  envs: string[] = [],
  rest: any = {},
) => ({
  [serviceName]: {
    build: {
      context: `./`,
      dockerfile: `apps/${serviceName}/Dockerfile`,
      args: {
        NPM_TOKEN: '${NPM_TOKEN}',
      },
    },
    deploy: {
      resources: {
        limits: {
          memory: '${MEM_LIMIT_APP}',
        },
        reservations: {
          cpus: '${CPU_SHARES_APP}',
        },
      },
    },
    environment: [
      'NODE_ENV=${NODE_ENV}',
      'DEPLOY_ENVIRONMENT=${DEPLOY_ENVIRONMENT}',
      ...envs,
    ],
    ...rest,
  },
});

const generateOverrideService = (
  serviceName: string,
  port: number,
  envs: string[] = [],
  extraVolumes: string[] = [],
  rest: any = {},
) => ({
  [serviceName]: {
    command: `yarn app:${serviceName}:dev`,
    ports: [`${port}:3000`],
    volumes: [
      `./apps/${serviceName}/src:/home/appuser/orders-be/apps/${serviceName}/src`,
      ...extraVolumes,
    ],
    environment: [...envs],
    ...rest,
  },
});

const generateDBEnvVars = (
  {
    user,
    password,
    host,
    db,
  }: { user?: string; password?: string; host?: string; db?: string } = {
    user: '${PG_USER}',
    password: '${PG_PASSWORD}',
    db: '${PG_DB}',
    host: '${PG_HOST}',
  },
) => {
  const envs = [];
  if (user) envs.push(`POSTGRES_USER=${user}`);
  if (password) envs.push(`POSTGRES_PASSWORD=${password}`);
  if (db) envs.push(`POSTGRES_DB=${db}`);
  if (host) envs.push(`POSTGRES_HOST=${host}`);
  return envs;
};
const generateTypeORMEnvVars = (
  serviceName: string,
  {
    user,
    password,
    host,
    db,
  }: { user?: string; password?: string; host?: string; db?: string } = {
    user: '${PG_USER}',
    password: '${PG_PASSWORD}',
    db: '${PG_DB}',
    host: '${PG_HOST}',
  },
) => {
  const envs = ['TYPEORM_CONNECTION=postgres'];
  if (user) envs.push(`TYPEORM_USERNAME=${user}`);
  if (password) envs.push(`TYPEORM_PASSWORD=${password}`);
  if (db) envs.push(`TYPEORM_DATABASE=${db}`);
  if (host) envs.push(`TYPEORM_HOST=${host}`);
  return envs;
};

const dockerCompose = {
  version: DOCKER_COMPOSE_FILE_VERSION,
  services: {
    ...generateService('fulfillment-service'),
    ...generateService('order-management-service'),
    ...generateService('organizations-service'),
    ...(() => {
      const customerDirectoryService = generateService(
        'customer-directory-service',
        generateTypeORMEnvVars('customer-directory-service'),
      );

      return {
        ...customerDirectoryService,
        'migration-container-customer-directory-service': {
          ...customerDirectoryService['customer-directory-service'],
          environment: [
            'TYPEORM_MIGRATIONS=apps/customer-directory-service/migrations/*.ts',
            'TYPEORM_MIGRATIONS_DIR=apps/customer-directory-service/migrations',
            ...customerDirectoryService['customer-directory-service']
              .environment,
          ],
          command: '/docker-migrations.sh',
        },
      };
    })(),
    ...generateService('gql-service'),
  },
};
const dockerComposeOverride = {
  version: dockerCompose.version,
  services: {
    ...generateOverrideService('fulfillment-service', generateNextPort()),
    ...generateOverrideService('order-management-service', generateNextPort()),
    ...generateOverrideService('organizations-service', generateNextPort()),
    ...(() => {
      const customerDirectoryService = generateOverrideService(
        'customer-directory-service',
        generateNextPort(),
        generateTypeORMEnvVars('customer-directory-service', {
          user: 'orders-be-user',
          password: 'password',
          host: 'local-db',
          db: 'customer-directory-service',
        }),
        [
          `./apps/customer-directory-service/migrations:/home/appuser/orders-be/apps/customer-directory-service/migrations`,
        ],
        {
          depends_on: [
            'local-db',
            'migration-container-customer-directory-service',
          ],
        },
      );
      return {
        ...customerDirectoryService,
        'migration-container-customer-directory-service': {
          ...customerDirectoryService['customer-directory-service'],
          ports: [`${generateNextPort()}:3000`],
          depends_on: ['local-db'],
          command: '/docker-migrations.sh',
        },
      };
    })(),
    ...generateOverrideService('gql-service', generateNextPort()),
    'local-db': {
      image: 'postgres:12-alpine',
      restart: 'always',
      environment: [
        ...generateDBEnvVars({ user: 'orders-be-user', password: 'password' }),
      ],
      ports: ['5432:5432'],
      volumes: ['postgresdata:/var/lib/postgresql/data5'],
    },
  },
  volumes: {
    postgresdata: {},
  },
};

fs.writeFileSync(DOCKER_COMPOSE_FILE, YAML.stringify(dockerCompose));
fs.writeFileSync(
  DOCKER_COMPOSE_OVERRIDE_FILE,
  YAML.stringify(dockerComposeOverride),
);

console.log(`Generated: ${DOCKER_COMPOSE_FILE}`);
console.log(`Generated: ${DOCKER_COMPOSE_OVERRIDE_FILE}`);
