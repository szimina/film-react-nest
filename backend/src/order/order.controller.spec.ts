import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        placeOrder: jest.fn().mockResolvedValue({
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
        }),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('.createOrder() should call createOrder() from service', async () => {
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

    const orderCreated = await controller.createOrder(order);
    expect(orderCreated).toEqual(order);
    expect(service.placeOrder).toHaveBeenCalledWith(order);
  });
});
