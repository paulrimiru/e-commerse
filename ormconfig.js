require('dotenv').config();

const url = require('url');

const BASE_DIR = 'dist';
const DB_URL = process.env.DATABASE_URL || 'sqlite:///./tmp/test.db';

const { protocol, pathname } = url.parse(DB_URL, true);

const config = {
  type: protocol.toLowerCase().slice(0, -1), // remove trailing ":"
};

if (config.type === 'sqlite') {
  config.database = pathname.slice(1); // remove leading "/"
} else {
  config.url = DB_URL;
}

module.exports = {
  ...config,
  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  logging: false,
  entities: [`${BASE_DIR}/**/*.entity.{ts,js}`],
  migrations: [`${BASE_DIR}/db/migrations/**/*.{ts,js}`],
  subscribers: [`${BASE_DIR}/db/subscribers/*.{ts,js}`],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/db/subscribers',
  },
};
