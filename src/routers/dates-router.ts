import { getDates } from "@/controllers/dates-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const datesRouter = Router();

datesRouter.all("/*", authenticateToken).get("", getDates).get("/:dateId");

export { datesRouter };
