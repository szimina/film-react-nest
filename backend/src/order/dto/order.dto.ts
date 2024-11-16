//TODO реализовать DTO для /orders
import { IsString, IsNumber } from 'class-validator';

class GetTicketDto {
  @IsString()
  film: string;
  @IsString()
  session: string;
  @IsString()
  daytime: string;
  @IsString()
  day: string;
  @IsString()
  time: string;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsNumber()
  price: number;
}

class ContactsDto {
  @IsString()
  email: string;
  @IsString()
  phone: string;
}

export class CreateOrderDto extends ContactsDto {
  tickets: GetTicketDto[];
}
