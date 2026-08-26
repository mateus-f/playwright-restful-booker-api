import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";
import { BookingFactory } from "../../../factories/booking-factory";

test.describe("Booking", () => {

  test.beforeEach(async ({ pingService }) => {
    const response = await pingService.getPing();
    expect(response.status()).toBe(201);
  });

  test("Consultar todos os identificadores de reservas", { tag: ["@smoke", "@funcional"] }, async ({ bookingService }) => {

    await test.step("Given que eu possua uma consulta válida de identificadores de reservas", () => { });

    const response = await test.step('When eu enviar uma requisição "GET" para a rota "/booking"', async () => {
      return bookingService.getBookings();
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    await test.step("And a resposta deve conter os identificadores das reservas existentes", async () => {
      const responseBody = await response.json();
      expect(responseBody.length).toBeGreaterThan(0);

      for (let i = 0; i < 5; i++) {
        expect(responseBody[i]).toHaveProperty("bookingid");
        expect(responseBody[i].bookingid).toBeGreaterThan(0);
      }
    });
  });

  test("Validar o contrato da consulta de identificadores", { tag: ["@contrato"] }, async ({ bookingService }) => {

    await test.step("Given que eu possua uma consulta válida de identificadores de reservas", () => { });

    const response = await test.step('When eu enviar uma requisição "GET" para a rota "/booking"', async () => {
      return bookingService.getBookings();
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();
    const sample = responseBody.slice(0, 5);

    await test.step("And a resposta deve ser uma lista de objetos", () => {
      expect(Array.isArray(responseBody)).toBeTruthy();
      expect(responseBody.length).toBeGreaterThan(0);

      for (const bookingItem of sample) {
        expect(typeof bookingItem).toBe("object");
      }
    });

    await test.step('And cada objeto da resposta deve conter o campo "bookingid"', () => {
      expect(sample).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )
    });

    await test.step('And o campo "bookingid" deve ser numérico', () => {
      for (const bookingItem of sample) {
        expect(typeof bookingItem.bookingid).toBe("number");
        expect(bookingItem.bookingid).toBeGreaterThan(0);
      }
    });
  });

  test("Filtrar reservas pelo nome do hóspede", { tag: ["@funcional"] }, async ({ bookingService }) => {

    const filterParams = BookingFactory.createNameFilter("John");

    await test.step(`Given que existam reservas associadas ao nome "${filterParams.firstname}"`, () => {
      expect(bookingService).toBeDefined();
    });

    const response = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking?firstname=${filterParams.firstname}"`, async () => {
      return await bookingService.getBookingsWithParams(filterParams);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step(`And a resposta deve conter somente identificadores de reservas correspondentes ao nome "${filterParams.firstname}"`, async () => {
      expect(responseBody.length).toBeGreaterThan(0);

      const sample = responseBody.slice(0, 5);

      for (const bookingItem of sample) {
        const bookingResponse = await bookingService.getBookingById(bookingItem.bookingid);
        expect(bookingResponse.status()).toBe(200);

        const bookingDetails = await bookingResponse.json();
        expect(bookingDetails.firstname).toEqual(filterParams.firstname);
      }
    });
  });

  test("Filtrar reservas pelo sobrenome do hóspede", { tag: ["@funcional"] }, async ({ bookingService }) => {

    const filterParams = BookingFactory.createNameFilter("", "Smith");

    await test.step(`Given que existam reservas associadas ao sobrenome "${filterParams.lastname}"`, () => {
      expect(bookingService).toBeDefined();
    });

    const response = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking?lastname=${filterParams.lastname}"`, async () => {
      return bookingService.getBookingsWithParams(filterParams);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step(`And a resposta deve conter somente identificadores de reservas correspondentes ao sobrenome "${filterParams.lastname}"`, async () => {
      expect(responseBody.length).toBeGreaterThan(0);

      const sample = responseBody.slice(0, 5);

      for (const bookingItem of sample) {
        const bookingResponse = await bookingService.getBookingById(bookingItem.bookingid);
        expect(bookingResponse.status()).toBe(200);

        const bookingDetails = await bookingResponse.json();
        expect(bookingDetails.lastname).toEqual(filterParams.lastname);
      }
    });
  });

  test("Filtrar reservas pela data de check-in", { tag: ["@funcional"] }, async ({ bookingService }) => {

    const filterParams = BookingFactory.createDateFilter("2025-12-31");

    await test.step(`Given que existam reservas com data de check-in "${filterParams.checkin}"`, () => {
      expect(bookingService).toBeDefined();
    });

    const response = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking?checkin=${filterParams.checkin}"`, async () => {
      return bookingService.getBookingsWithParams(filterParams);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step(`And a resposta deve conter somente identificadores de reservas correspondentes ao checkin "${filterParams.checkin}"`, async () => {
      expect(responseBody.length).toBeGreaterThan(0);

      const sample = responseBody.slice(0, 5);
      const filterTimestamp = new Date(filterParams.checkin).getTime();

      for (const bookingItem of sample) {
        const bookingResponse = await bookingService.getBookingById(bookingItem.bookingid);
        expect(bookingResponse.status()).toBe(200);

        const bookingDetails = await bookingResponse.json();
        const actualCheckinTimestamp = new Date(bookingDetails.bookingdates.checkin).getTime();

        expect(actualCheckinTimestamp).toBeGreaterThan(filterTimestamp);
      }
    });
  });

  test("Filtrar reservas pela data de checkout", { tag: ["@funcional"] }, async ({ bookingService }) => {

    const filterParams = BookingFactory.createDateFilter("", "2026-01-10");

    await test.step(`Given que existam reservas com data de checkout "${filterParams.checkout}"`, () => {
      expect(bookingService).toBeDefined();
    });

    const response = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking?checkout=${filterParams.checkout}"`, async () => {
      return bookingService.getBookingsWithParams(filterParams);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step(`And a resposta deve conter somente identificadores de reservas correspondentes ao checkout "${filterParams.checkout}"`, async () => {
      expect(responseBody.length).toBeGreaterThan(0);

      const sample = responseBody.slice(0, 5);
      const filterTimestamp = new Date(filterParams.checkout).getTime();

      for (const bookingItem of sample) {
        const bookingResponse = await bookingService.getBookingById(bookingItem.bookingid);
        expect(bookingResponse.status()).toBe(200);

        const bookingDetails = await bookingResponse.json();
        const actualCheckoutTimestamp = new Date(bookingDetails.bookingdates.checkout).getTime();

        expect(actualCheckoutTimestamp).toBeLessThanOrEqual(filterTimestamp);
      }
    });
  });

  test("Filtrar reservas combinando nome e período", { tag: ["@funcional"] }, async ({ bookingService }) => {

    const filterParams = BookingFactory.createCombinedFilter("John", "Smith", "2010-01-01", "2026-01-10");

    await test.step(`Given que existam reservas associadas ao nome "${filterParams.firstname}" com sobrenome "${filterParams.lastname}" no período de "${filterParams.checkin}" a "${filterParams.checkout}"`, () => {
      expect(bookingService).toBeDefined();
    });

    const response = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking?firstname=${filterParams.firstname}&lastname=${filterParams.lastname}&checkin=${filterParams.checkin}&checkout=${filterParams.checkout}"`, async () => {
      return bookingService.getBookingsWithParams(filterParams);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step(`And a resposta deve conter somente identificadores correspondentes ao nome completo "${filterParams.firstname} ${filterParams.lastname}" e ao período informado`, async () => {
      expect(responseBody.length).toBeGreaterThan(0);

      const sample = responseBody.slice(0, 5);
      const minCheckinTimestamp = new Date(filterParams.checkin).getTime();
      const maxCheckoutTimestamp = new Date(filterParams.checkout).getTime();

      for (const bookingItem of sample) {
        const bookingResponse = await bookingService.getBookingById(bookingItem.bookingid);
        expect(bookingResponse.status()).toBe(200);

        const bookingDetails = await bookingResponse.json();
        const actualCheckinTimestamp = new Date(bookingDetails.bookingdates.checkin).getTime();
        const actualCheckoutTimestamp = new Date(bookingDetails.bookingdates.checkout).getTime();

        expect(actualCheckinTimestamp).toBeGreaterThan(minCheckinTimestamp);
        expect(actualCheckoutTimestamp).toBeLessThanOrEqual(maxCheckoutTimestamp);
      }
    });
  });
});