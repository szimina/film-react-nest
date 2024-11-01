import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { GetFilmDto } from '../films/dto/films.dto';
import { Film } from '../films/schemas/film.schema';
import { SessionNotFoundException } from '../exceptions/sessionNotFoundException';
import { FilmNotFoundException } from '../exceptions/filmNotFoundException';
import { ServerErrorException } from '../exceptions/serverErrorException';

export class FilmsRepositoryMongo {
  constructor(@Inject('FILM_DB') private filmsRepository: Model<Film>) {}

  private getFilmMapperFn(): (filmFromDB: Film) => GetFilmDto {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        title: root.title,
        about: root.about,
        description: root.description,
        image: root.image,
        cover: root.cover,
        schedule: root.schedule,
      };
    };
  }

  async findAllFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
    const films = await this.filmsRepository.find({});
    const total = await this.filmsRepository.countDocuments({});
    return {
      total,
      items: films.map(this.getFilmMapperFn()),
    };
  }

  async findFilmById(filmId: string): Promise<GetFilmDto> {
    try {
      const film = await this.filmsRepository.findOne({ id: filmId });
      return film;
    } catch (error) {
      throw new FilmNotFoundException(filmId);
    }
  }

  async getSessionData(filmId: string, sessionId: string): Promise<string[]> {
    try {
      const film = await this.filmsRepository.findOne({ id: filmId });
      const sessionIndex = film.schedule.findIndex((session) => {
        return session.id === sessionId;
      });
      return film.schedule[sessionIndex].taken;
    } catch (error) {
      throw new SessionNotFoundException(sessionId);
    }
  }

  async placeSeatsOrder(
    filmId: string,
    sessionId: string,
    seats: string,
  ): Promise<string[]> {
    const film = await this.filmsRepository.findOne({ id: filmId });
    const sessionIndex = film.schedule.findIndex((session) => {
      return session.id === sessionId;
    });
    try {
      await this.filmsRepository.updateOne(
        { id: filmId },
        { $push: { [`schedule.${sessionIndex.toString()}.taken`]: seats } },
      );
      return;
    } catch (error) {
      new ServerErrorException(error.message);
    }
  }
}
