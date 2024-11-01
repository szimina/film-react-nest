import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Film } from '../films/entities/film.entity';

export class FilmsRepositoryPostgres {
  constructor(
    @Inject('FILM_DB')
    private filmsRepository: Repository<Film>,
  ) {}

  async findAllFilms(): Promise<Film[]> {
    console.log('я тут')
    console.log(this.filmsRepository)
    return this.filmsRepository.find();
  }

  async findFilmById(id: string): Promise<Film> {
    return;
  }
}
