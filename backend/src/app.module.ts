import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { ConfigProvider } from './app.config.provider';
import { DatabaseModule } from './database/database.module';
import { FilmsProvider } from './films/films.provider';
import { FilmsRepository } from './repository/films.repository';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';

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
    DatabaseModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    ConfigProvider,
    FilmsProvider,
    FilmsRepository,
    FilmsService,
    OrderService,
  ],
})
export class AppModule {}
