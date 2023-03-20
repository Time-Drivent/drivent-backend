import daysService from "@/services/days-service";
import activityService from "@/services/activities-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";

export async function getDays(req: Request, res: Response) {
  try {
    const dates = await daysService.getDays();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getEvents(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const eventDayId = Number(req.query.eventDayId);
  try {
    const events = await activityService.getEvents(Number(userId), eventDayId);
    return res.status(httpStatus.OK).send(events);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
