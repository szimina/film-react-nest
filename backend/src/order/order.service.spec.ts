import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepositoryPostgres } from '../repository/filmsPostgres.repository';
import { FilmsRepositoryMongo } from '../repository/filmsMongo.repository';
import { OrderService } from './order.service';
import { seatsOccupiedException } from '../exceptions/seatsOccupiedException';

describe('FilmsService', () => {
  let service: OrderService;

  const FilmsRepositoryPostgresMock = {
    getSessionData: jest.fn().mockResolvedValue('2:1'),
    placeSeatsOrder: jest.fn(),
  };

  const FilmsRepositoryMongoMock = {
    getSessionData: jest.fn(),
    placeSeatsOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
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

    service = module.get<OrderService>(OrderService);
  });

  it('.placeOrder() should call placeOrder() from repository', async () => {
    const order = {
      email: 'test@yandex.ru',
      phone: '79057777777',
      tickets: [
        {
          film: '3bedbc5a-844b-40eb-9d77-83b104e0cf75',
          session: '351b437c-3430-4a35-b71d-b93b3d80274a',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '2024-06-28',
          time: '10:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };

    const orderCreated = await service.placeOrder(order);

    expect(orderCreated).toEqual(order);
    expect(FilmsRepositoryPostgresMock.placeSeatsOrder).toHaveBeenCalledWith(
      order.tickets[0].film,
      order.tickets[0].session,
      `${order.tickets[0].row}:${order.tickets[0].seat}`,
    );
  });

  it('.placeOrder() should throw an error', async () => {
    const order = {
      email: 'test@yandex.ru',
      phone: '79057777777',
      tickets: [
        {
          film: '3bedbc5a-844b-40eb-9d77-83b104e0cf75',
          session: '351b437c-3430-4a35-b71d-b93b3d80274a',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '2024-06-28',
          time: '10:00',
          row: 2,
          seat: 1,
          price: 350,
        },
      ],
    };

    await expect(service.placeOrder(order)).rejects.toThrow(
      seatsOccupiedException,
    );
  });
});
