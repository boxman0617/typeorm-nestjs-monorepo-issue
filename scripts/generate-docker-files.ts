import * as path from 'path';
import * as fs from 'fs';

const apps = [
  'fulfillment-service',
  'order-management-service',
  'organizations-service',
  'customer-directory-service',
  'gql-service',
];

const ROOT_DIR = path.resolve(__dirname, '../');
const NODE_VERSION = fs
  .readFileSync(`${ROOT_DIR}/.nvmrc`)
  .toString()
  .trim();
const APPS_DIR = path.resolve(ROOT_DIR, 'apps');

const dockerfileTemplate =
  // language=Dockerfile
  (appName: string) =>
    `FROM node:${NODE_VERSION}-alpine

ARG NPM_TOKEN

WORKDIR /tmp

ADD npmrc.template /tmp/.npmrc
ADD yarn.lock /tmp/yarn.lock
ADD package.json /tmp/package.json
ADD nest-cli.json /tmp/nest-cli.json
ADD tsconfig.json /tmp/tsconfig.json
ADD tsconfig.build.json /tmp/tsconfig.build.json

RUN yarn

RUN mkdir -p /var/www/orders-be && \\
    cp -a /tmp/package.json /var/www/orders-be && \\
    cp -a /tmp/nest-cli.json /var/www/orders-be && \\
    cp -a /tmp/tsconfig.json /var/www/orders-be && \\
    cp -a /tmp/tsconfig.build.json /var/www/orders-be && \\
    cp -a /tmp/node_modules /var/www/orders-be

WORKDIR /var/www/orders-be
ADD ./apps/${appName}/. /var/www/orders-be/apps/${appName}

RUN NODE_ENV=production yarn app:${appName}:build

FROM node:${NODE_VERSION}-alpine

RUN apk add --update --no-cache bash bind-tools
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \\
    mkdir -p /home/appuser/orders-be

WORKDIR /home/appuser/orders-be
RUN apk add --no-cache bash

COPY --from=0 /var/www/orders-be .

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
COPY ./docker-migrations.sh /
RUN chmod +x /docker-migrations.sh
COPY ./scripts/db-setup.ts ./scripts/
COPY ./proto ./proto

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node_modules/.bin/pm2-runtime", "apps/${appName}/process.yml"]
`;

const processYMLTemplate =
  // language=yaml
  (appName: string) =>
    `apps:
  - script             : './dist/apps/${appName}/main.js'
    name               : '${appName}'
    exec_mode          : 'cluster'
    instances          : '-1'
    merge_logs         : true
    max_memory_restart : '512M'
`;

(async () => {
  (
    await Promise.all([
      ...apps.map(
        app =>
          new Promise((resolve, reject) => {
            const dockerfilePath = `${APPS_DIR}/${app}/Dockerfile`;
            fs.writeFile(dockerfilePath, dockerfileTemplate(app), err => {
              if (err) return reject(err);
              resolve(dockerfilePath);
            });
          }),
      ),
      ...apps.map(
        app =>
          new Promise((resolve, reject) => {
            const processFilePath = `${APPS_DIR}/${app}/process.yml`;
            fs.writeFile(processFilePath, processYMLTemplate(app), err => {
              if (err) return reject(err);
              resolve(processFilePath);
            });
          }),
      ),
    ])
  ).forEach(filename => console.log(`Generated: ${filename}`));
})();
