import { postActivityTicket } from "@/controllers/activities-controller";
import { getDays, getEvents } from "@/controllers/days-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const daysRouter = Router();

daysRouter
  .all("/*", authenticateToken)
  .get("", getDays)
  .get("/events", getEvents)
  .post("/", postActivityTicket);

export { daysRouter };
