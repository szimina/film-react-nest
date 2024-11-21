import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Film } from '../films/entities/film.entity';
import { FilmNotFoundException } from '../exceptions/filmNotFoundException';
import { SessionNotFoundException } from '../exceptions/sessionNotFoundException';
import { ServerErrorException } from '../exceptions/serverErrorException';
import { Schedule } from '../films/entities/schedule.entity';

export class FilmsRepositoryPostgres {
  constructor(
    @Inject('FILM_DB')
    private filmsRepository: Repository<Film>,
  ) {}

  async findAllFilms(): Promise<{ total: number; tickets: Film[] }> {
    const [total, tickets] = await Promise.all([
      this.filmsRepository.count(),
      this.filmsRepository.find({ relations: { schedule: true } }),
    ]);

    return { total, tickets };
  }

  async findFilmById(
    filmId: string,
  ): Promise<{ total: number; tickets: Schedule[] }> {
    try {
      const film = await this.filmsRepository.findOne({
        where: { id: filmId },
        relations: { schedule: true },
      });
      return {
        total: film.schedule.length,
        tickets: film.schedule,
      };
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
    const film = await this.filmsRepository.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
    const sessionIndex = film.schedule.findIndex((session) => {
      return session.id === sessionId;
    });
    const previousData = film.schedule[sessionIndex].taken;
    const newData = previousData.concat(seats);
    film.schedule[sessionIndex].taken = newData;

    try {
      await this.filmsRepository.save(film);
      return;
    } catch (error) {
      new ServerErrorException('Неизвестная ошибка сервера');
    }
  }
}
