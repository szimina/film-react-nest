import { HttpException, HttpStatus } from '@nestjs/common';

export class FilmNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Фильм с id ${id} не найден`, HttpStatus.BAD_REQUEST);
  }
}
