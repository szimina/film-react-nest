import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest
          .fn()
          .mockResolvedValue([{ id: 'test id 1' }, { id: 'test id 2' }]),
        findById: jest.fn().mockResolvedValue({ id: 'test id 3' }),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('.getFilms() should call findAll() from service', async () => {
    const films = await controller.getFilms();
    expect(films).toEqual([{ id: 'test id 1' }, { id: 'test id 2' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.getFilmShedule() should call findById() from service', async () => {
    const id = 'test id 3';
    const film = await controller.getFilmShedule(id);
    expect(film).toEqual({ id: 'test id 3' });
    expect(service.findById).toHaveBeenCalledWith(id);
  });
});
