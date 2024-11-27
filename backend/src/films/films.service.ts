import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmNotFoundException } from '../exceptions/filmNotFoundException';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<{ total: number; items: Film[] }> {
    const [total, items] = await Promise.all([
      this.filmsRepository.count(),
      this.filmsRepository.find({ relations: { schedule: true } }),
    ]);

    return { total, items };
  }

  async findById(
    filmId: string,
  ): Promise<{ total: number; items: Schedule[] }> {
    try {
      const film = await this.filmsRepository.findOne({
        where: { id: filmId },
        relations: { schedule: true },
      });
      return {
        total: film.schedule.length,
        items: film.schedule,
      };
    } catch (error) {
      throw new FilmNotFoundException(filmId);
    }
  }
}
