import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { PostgresConfig } from './config/postgres.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfig,
      inject: [PostgresConfig],
    }),
    OrderModule,
    FilmsModule,
  ],
})
export class AppModule {}
