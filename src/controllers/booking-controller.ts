import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function bookingRoom(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const { roomId } = req.body;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.bookingRoomById(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const bookingId = Number(req.params.bookingId);

    if (!bookingId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const { roomId } = req.body;

    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.changeBookingRoomById(userId, Number(roomId));

    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    if (error.name === "CannotBookingError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function UserBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getUserBooking(userId);
    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      Room: {
        id: booking.Room.id,
        name: booking.Room.name,
        capacity: booking.Room.capacity,
        hotelId: booking.Room.hotelId,
        Booking: booking.Room._count.Booking,
        Hotel: {
          id: booking.Room.Hotel.id,
          name: booking.Room.Hotel.name,
          image: booking.Room.Hotel.image,
        },
      },
    });
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
