import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('filmstest')
export class FilmsController {
  constructor(private readonly filmsDatabase: FilmsService) {}

  @Get()
  getFilms() {
    return this.filmsDatabase.findAll();
  }

  @Get(':id/schedule')
  getFilmShedule(@Param('id') id: string) {
    return this.filmsDatabase.findById(id);
  }
}
