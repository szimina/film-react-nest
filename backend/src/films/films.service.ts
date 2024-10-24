import { Injectable } from '@nestjs/common';
import { GetFilmDto } from './dto/films.dto';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmDatabase: FilmsRepository) {}

  async findAll() {
    return this.filmDatabase.findAllFilms();
  }

  async findById(id: string): Promise<GetFilmDto> {
    return this.filmDatabase.findFilmById(id);
  }
}
