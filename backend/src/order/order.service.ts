import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { seatsOccupiedException } from '../exceptions/seatsOccupiedException';
import { AppConfig } from '../app.config.provider';
import { FilmsRepositoryMongo } from '../repository/filmsMongo.repository';
import { FilmsRepositoryPostgres } from '../repository/filmsPostgres.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CONFIG') private readonly config: AppConfig,
    private readonly filmDatabaseMongo: FilmsRepositoryMongo,
    private readonly filmDatabasePostgres: FilmsRepositoryPostgres,
  ) {}

  async placeOrder(orderData: CreateOrderDto): Promise<CreateOrderDto> {
    const ticketsAvailableForPurchase = [];

    if (this.config.database.driver === 'mongodb') {
      for (const ticket of orderData.tickets) {
        const sessionData = await this.filmDatabaseMongo.getSessionData(
          ticket.film,
          ticket.session,
        );

        const seatsSelection = `${ticket.row}:${ticket.seat}`;
        if (sessionData.includes(seatsSelection)) {
          throw new seatsOccupiedException(seatsSelection);
        }
        ticketsAvailableForPurchase.push({
          filmId: ticket.film,
          sessionId: ticket.session,
          seatsSelection: seatsSelection,
        });
      }
      if (ticketsAvailableForPurchase.length > 0) {
        ticketsAvailableForPurchase.forEach((ticket) => {
          const { filmId, sessionId, seatsSelection } = ticket;
          this.filmDatabaseMongo.placeSeatsOrder(
            filmId,
            sessionId,
            seatsSelection,
          );
        });
      }
      return;
    } else if (this.config.database.driver === 'postgres') {
      for (const ticket of orderData.tickets) {
        const sessionData = await this.filmDatabasePostgres.getSessionData(
          ticket.film,
          ticket.session,
        );

        const seatsSelection = `${ticket.row}:${ticket.seat}`;
        if (sessionData.includes(seatsSelection)) {
          throw new seatsOccupiedException(seatsSelection);
        }

        ticketsAvailableForPurchase.push({
          filmId: ticket.film,
          sessionId: ticket.session,
          seatsSelection: seatsSelection,
        });
      }
      if (ticketsAvailableForPurchase.length > 0) {
        ticketsAvailableForPurchase.forEach((ticket) => {
          const { filmId, sessionId, seatsSelection } = ticket;
          this.filmDatabasePostgres.placeSeatsOrder(
            filmId,
            sessionId,
            seatsSelection,
          );
        });
      }
    }
    return orderData;
  }
}
