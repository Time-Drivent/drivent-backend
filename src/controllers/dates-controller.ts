import datesService from "@/services/dates-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getDates(req: Request, res: Response) {
  try {
    const dates = datesService.getDates();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
