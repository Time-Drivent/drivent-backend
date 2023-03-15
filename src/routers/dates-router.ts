import { getDates, getEvents } from "@/controllers/dates-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const datesRouter = Router();

datesRouter
  .all("/*", authenticateToken)
  .get("", getDates)
  .get("/events", getEvents)
  .get("/activitiesBooking",);

export { datesRouter };
