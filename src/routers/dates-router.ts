import { postActivityTicket } from "@/controllers/activities-controller";
import { getDates, getEvents } from "@/controllers/dates-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const datesRouter = Router();

datesRouter
  .all("/*", authenticateToken)
  .get("", getDates)
  .get("/events", getEvents)
  .post("/",postActivityTicket);

export { datesRouter };
