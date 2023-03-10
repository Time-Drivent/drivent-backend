import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, UserBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", listBooking)
  .get("/me", UserBooking)
  .post("", bookingRoom)
  .put("/:bookingId", changeBooking);

export { bookingRouter };
