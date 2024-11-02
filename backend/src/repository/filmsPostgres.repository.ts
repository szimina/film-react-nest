import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Film } from '../films/entities/film.entity';
import { FilmNotFoundException } from '../exceptions/filmNotFoundException';
import { SessionNotFoundException } from '../exceptions/sessionNotFoundException';
import { ServerErrorException } from '../exceptions/serverErrorException';

export class FilmsRepositoryPostgres {
  constructor(
    @Inject('FILM_DB')
    private filmsRepository: Repository<Film>,
  ) {}

  async findAllFilms(): Promise<{ total: number; items: Film[] }> {
    const [total, items] = await Promise.all([
      this.filmsRepository.count(),
      this.filmsRepository.find({ relations: { schedule: true } }),
    ]);

    return { total, items };
  }

  async findFilmById(filmId: string): Promise<Film> {
    try {
      return this.filmsRepository.findOne({
        where: { id: filmId },
        relations: { schedule: true },
      });
    } catch (error) {
      throw new FilmNotFoundException(filmId);
    }
  }

  async getSessionData(filmId: string, sessionId: string) {
    try {
      const film = await this.filmsRepository.findOne({
        where: { id: filmId },
        relations: { schedule: true },
      });
      const sessionIndex = film.schedule.findIndex((session) => {
        return session.id === sessionId;
      });
      return film.schedule[sessionIndex].taken;
    } catch (error) {
      throw new SessionNotFoundException(sessionId);
    }
  }

  async placeSeatsOrder(filmId: string, sessionId: string, seats: string) {
    const myFilm = await this.filmsRepository.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
    const sessionIndex = myFilm.schedule.findIndex((session) => {
      return session.id === sessionId;
    });
    const previousData = myFilm.schedule[sessionIndex].taken;
    const newData = previousData.concat(seats);
    myFilm.schedule[sessionIndex].taken = newData;
    console.log(myFilm.schedule[sessionIndex].taken);

    try {
      //await myFilm.save();
      return;
    } catch (error) {
      new ServerErrorException('Неизвестная ошибка сервера');
    }
  }
}
