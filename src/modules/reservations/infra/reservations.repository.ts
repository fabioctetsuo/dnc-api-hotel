import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation, ReservationStatus } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }

  findById(id: number): Promise<Reservation> {
    return this.prisma.reservation.findUnique({ where: { id }, include: {
      user: true
    } }).then((reservation) => {
      if (reservation.user.avatar) {
        reservation.user.avatar = `${process.env.APP_API_URL}/user-avatar/${reservation.user.avatar}`
      }
      return reservation
    });
  }
  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }
  findByUser(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ where: { userId } });
  }

  updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return this.prisma.reservation.update({ where: { id }, data: { status } });
  }
}
