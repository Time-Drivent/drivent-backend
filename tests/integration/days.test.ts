import app, { init } from "@/app";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createActivity, createEnrollmentWithAddress, createPayment, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import { createDay } from "../factories/days-factory";
import dayjs from "dayjs";
import { prisma } from "@/config";
import { createVenue } from "../factories/venues-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);
/*
describe("GET /dates", () => {
  const URL = "/dates";
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get(URL);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when enrollment not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
  
      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      await createDay();

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});
*/
describe("GET /dates", () => {
  const URL = "/dates";
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get(URL);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when days not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createDay();
      const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
      const { body, status } = response;
      expect(status ).toEqual(httpStatus.OK); 
      expect(body).toEqual([
        {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          date: expect.any(String),
          id: expect.any(Number),
          weekday: expect.any(String)
        }
      ]);
    });
  });
});

describe("GET /dates/events", () => {
  const URL = "/dates/events";
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get(URL);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when enrollment not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`).set({
        eventDayId: 1
      });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`).set({
        eventDayId: 1
      });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`).set({
        eventDayId: 1
      });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when day not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get(URL).set("Authorization", `Bearer ${token}`).set({
        eventDayId: 1
      });
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const day = await createDay();
      const venue = await createVenue();
      const eventDay = await createActivity(day.id, venue.id);

      const response = await server.get(URL + "?eventDayId=" + day.id).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe("POST /dates", () => {
  const URL = "/dates";
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post(URL);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.post(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.post(URL).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if body is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      
      const response = await server.post(URL).set("Authorization", `Bearer ${token}`).send({});
      
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
