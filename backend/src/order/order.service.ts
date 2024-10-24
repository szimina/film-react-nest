import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';
import { seatsOccupiedException } from '../exceptions/seatsOccupiedException';

@Injectable()
export class OrderService {
  constructor(private readonly filmDatabase: FilmsRepository) {}

  async placeOrder(orderData: CreateOrderDto): Promise<any> {
    const ticketsAvailableForPurchase = [];

    for (const order of orderData.getOrderData) {
      const sessionData = await this.filmDatabase.getSessionData(
        order.filmId,
        order.sessionId,
      );
      if (sessionData.includes(order.seatsSelection)) {
        throw new seatsOccupiedException(order.seatsSelection);
      }

      ticketsAvailableForPurchase.push({
        filmId: order.filmId,
        sessionId: order.sessionId,
        seatsSelection: order.seatsSelection,
      });
    }
    if (ticketsAvailableForPurchase.length > 0) {
      ticketsAvailableForPurchase.forEach((ticket) => {
        const { filmId, sessionId, seatsSelection } = ticket;
        this.filmDatabase.placeSeatsOrder(filmId, sessionId, seatsSelection);
      });
    }

    return orderData;
  }
}
