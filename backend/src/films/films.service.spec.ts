import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepositoryPostgres } from '../repository/filmsPostgres.repository';
import { FilmsRepositoryMongo } from '../repository/filmsMongo.repository';

describe('FilmsService', () => {
  let service: FilmsService;

  const FilmsRepositoryPostgresMock = {
    findAllFilms: jest
      .fn()
      .mockResolvedValue([{ id: 'test id 1' }, { id: 'test id 2' }]),
    findFilmById: jest.fn().mockResolvedValue({ id: 'test id 3' }),
  };

  const FilmsRepositoryMongoMock = {
    findAllFilms: jest.fn(),
    findFilmById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'CONFIG',
          useValue: {
            database: {
              driver: 'postgres',
            },
          },
        },
        {
          provide: FilmsRepositoryPostgres,
          useValue: FilmsRepositoryPostgresMock,
        },
        {
          provide: FilmsRepositoryMongo,
          useValue: FilmsRepositoryMongoMock,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('.findAll() should call findAllFilms() from repository', async () => {
    const films = await service.findAll();
    expect(films).toEqual([{ id: 'test id 1' }, { id: 'test id 2' }]);
    expect(FilmsRepositoryPostgresMock.findAllFilms).toHaveBeenCalled();
  });

  it('.findById() should call findFilmById() from repository', async () => {
    const id = 'test id 3';
    const film = await service.findById(id);
    expect(film).toEqual({ id: 'test id 3' });
    expect(FilmsRepositoryPostgresMock.findFilmById).toHaveBeenCalledWith(id);
  });
});
