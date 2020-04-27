import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  envConfig;

  constructor(filePath) {
    const jsonString = fs.readFileSync(filePath).toString();
    this.envConfig = JSON.parse(jsonString);
  }

  get(key) {
    return this.envConfig[key];
  }
}
