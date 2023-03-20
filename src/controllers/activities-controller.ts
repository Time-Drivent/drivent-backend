import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import httpStatus from "http-status";
import { Response } from "express";

export async function postActivityTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.body;

  if (!activityId || activityId < 1) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    await activityService.createActivityTicket(activityId, userId);
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
