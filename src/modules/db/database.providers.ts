import { createConnection, getConnectionOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const connection = await createConnection(await getConnectionOptions());
      await connection.runMigrations();
      return connection;
    },
  },
];
