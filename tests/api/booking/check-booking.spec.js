import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";

test.describe("Consulta de reserva", () => {

  test("Consultar uma reserva existente", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService }) => {

    const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
      const bookingResponse = await bookingService.getBookings();
      expect(bookingResponse.status()).toBe(200);

      const bookingResponseBody = await bookingResponse.json();
      expect(bookingResponseBody.length).toBeGreaterThan(0);

      return bookingResponseBody[0].bookingid;
    });

    const checkBookingResponse = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking/${bookingId}"`, async () => {
      return await bookingService.getBookingById(bookingId);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(checkBookingResponse.status()).toBe(200);
    });

    const checkBookingResponseBody = await checkBookingResponse.json();

    await test.step('And a resposta deve conter os dados completos da reserva', () => {
      expect(checkBookingResponseBody.firstname).not.toBeNull();
      expect(checkBookingResponseBody.lastname).not.toBeNull();
      expect(checkBookingResponseBody.totalprice).not.toBeNull();
      expect(checkBookingResponseBody.totalprice).toBeGreaterThanOrEqual(0);
      expect(checkBookingResponseBody.depositpaid).not.toBeNull();
      expect(checkBookingResponseBody.bookingdates).not.toBeNull();
      expect(checkBookingResponseBody).not.toBeNull();
    });
  });

  test("Validar o contrato dos dados da reserva", ({ tag: ["@contrato"] }), async ({ bookingService }) => {

    const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
      const bookingResponse = await bookingService.getBookings();
      expect(bookingResponse.status()).toBe(200);

      const bookingResponseBody = await bookingResponse.json();
      expect(bookingResponseBody.length).toBeGreaterThan(0);

      return bookingResponseBody[0].bookingid;
    });

    const checkBookingResponse = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking/${bookingId}"`, async () => {
      return await bookingService.getBookingById(bookingId);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(checkBookingResponse.status()).toBe(200);
    });

    const checkBookingResponseBody = await checkBookingResponse.json();

    await test.step('And o corpo da resposta deve conter as chaves "firstname", "lastname", "totalprice", "depositpaid", "bookingdates" e "additionalneeds"', () => {
      expect(checkBookingResponseBody).toHaveProperty("firstname");
      expect(checkBookingResponseBody).toHaveProperty("lastname");
      expect(checkBookingResponseBody).toHaveProperty("totalprice");
      expect(checkBookingResponseBody).toHaveProperty("depositpaid");
      expect(checkBookingResponseBody).toHaveProperty("bookingdates");
      expect(checkBookingResponseBody).toHaveProperty("additionalneeds");
    });

    await test.step('And as chaves "firstname" e "lastname" devem possuir valores textuais', () => {
      expect(typeof checkBookingResponseBody.firstname).toBe("string");
      expect(typeof checkBookingResponseBody.lastname).toBe("string");
    });

    await test.step('And a chave "totalprice" deve possuir um valor numérico', () => {
      expect(typeof checkBookingResponseBody.totalprice).toBe("number");
    });

    await test.step('And a chave "depositpaid" deve possuir um valor booleano', () => {
      expect(typeof checkBookingResponseBody.depositpaid).toBe("boolean");
    });

    await test.step('And a chave "bookingdates" deve possuir as chaves "checkin" e "checkout" com valores de data válidos', () => {
      expect(typeof checkBookingResponseBody.bookingdates).toBe("object");
      expect(checkBookingResponseBody.bookingdates).toHaveProperty("checkin");
      expect(checkBookingResponseBody.bookingdates).toHaveProperty("checkout");

      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(checkBookingResponseBody.bookingdates.checkin).toMatch(isoDateRegex);
      expect(checkBookingResponseBody.bookingdates.checkout).toMatch(isoDateRegex);
    });

    await test.step('And a chave "additionalneeds" deve possuir um valor textual', () => {
      expect(typeof checkBookingResponseBody.additionalneeds).toBe("string");
    });
  });

  test("Consultar uma reserva inexistente ou inválida", ({ tag: ["@excecao",] }), async ({ bookingService }) => {

    const invalidBookingIds = [9999999, 'abc', -1];

    for (const invalidId of invalidBookingIds) {
      const id = await test.step(`Given que eu informe o identificador de reserva "${invalidId}"`, () => invalidId);

      const checkBookingResponse = await test.step(`When eu enviar uma requisição "GET" para a rota "/booking/${id}"`, async () => {
        return await bookingService.getBookingById(id);
      });

      await test.step("Then o código de status HTTP retornado deve ser 404", () => {
        expect(checkBookingResponse.status()).toBe(404);
      });
    }
  });
});
