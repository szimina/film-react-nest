import { Module } from '@nestjs/common';
import { ConfigProvider } from '../app.config.provider';
import { DatabaseProvider } from './database.provider';

@Module({
  providers: [ConfigProvider, DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}