import { createDatabase } from 'pg-god';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

let conn: Connection | undefined;

const superCreateConnection = async (): Promise<Connection> => {
  if (conn) return conn;
  const ormOpts: PostgresConnectionOptions = (await getConnectionOptions()) as PostgresConnectionOptions;
  try {
    conn = await createConnection(ormOpts);
    return conn;
  } catch (error) {
    if (error.code === '3D000') {
      // Database doesn't exist.
      // PG error code ref: https://docstore.mik.ua/manuals/sql/postgresql-8.2.6/errcodes-appendix.html
      await createDatabase(
        { databaseName: ormOpts.database },
        {
          user: ormOpts.username,
          port: ormOpts.port,
          host: ormOpts.host,
          password:
            typeof ormOpts.password === 'undefined'
              ? undefined
              : typeof ormOpts.password === 'string'
              ? ormOpts.password
              : await ormOpts.password(),
        },
      );
      return superCreateConnection();
    }
    throw error;
  }
};

(async () => {
  await superCreateConnection();
})();
