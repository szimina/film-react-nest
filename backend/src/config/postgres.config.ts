import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>(
        'DB_HOST',
        process.env.POSTGRES_HOST,
      ),
      port: this.configService.get<number>(
        'DB_PORT',
        Number(process.env.POSTGRES_PORT),
      ),
      username: this.configService.get<string>(
        'DB_USERNAME',
        process.env.POSTGRES_USER,
      ),
      password: this.configService.get<string>(
        'DB_PASSWORD',
        process.env.POSTGRES_PASSWORD,
      ),
      database: this.configService.get<string>(
        'DB_DATABASE',
        process.env.POSTGRES_DB,
      ),
      entities: [__dirname + '/../**/*.entity{.js,.ts}'],
      synchronize: true,
    };
  }
}
