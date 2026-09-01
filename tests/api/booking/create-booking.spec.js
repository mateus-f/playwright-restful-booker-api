import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";
import { BookingFactory } from "../../../factories/booking-factory";
import { validateSchema } from "../../../utils/schema-validator";
import { createBookingSchema } from "../../../schemas/create-booking-schema";

test.describe("Criação de reservas", () => {

  test("Criar uma reserva com sucesso", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService }) => {

    const bookingPayload = await test.step("Given que eu possua um payload válido de reserva", () => {
      return BookingFactory.createBookingPayload();
    });

    const response = await test.step('When eu enviar uma requisição "POST" para a rota "/booking"', async () => {
      return bookingService.createBooking(bookingPayload);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step("And o corpo da resposta deve conter o identificador da reserva criada", () => {
      expect(responseBody).toHaveProperty("bookingid");
      expect(responseBody.bookingid).toBeGreaterThan(0);
    });

    await test.step("And os dados retornados devem corresponder aos dados enviados", () => {
      expect(responseBody.booking.firstname).toBe(bookingPayload.firstname);
      expect(responseBody.booking.lastname).toBe(bookingPayload.lastname);
      expect(responseBody.booking.totalprice).toBe(bookingPayload.totalprice);
      expect(responseBody.booking.depositpaid).toBe(bookingPayload.depositpaid);
      expect(responseBody.booking.bookingdates.checkin).toBe(bookingPayload.bookingdates.checkin);
      expect(responseBody.booking.bookingdates.checkout).toBe(bookingPayload.bookingdates.checkout);
      expect(responseBody.booking.additionalneeds).toBe(bookingPayload.additionalneeds);
    });
  });

  test("Validar o contrato da resposta de criação", ({ tag: ["@contrato"] }), async ({ bookingService }) => {

    const bookingPayload = await test.step("Given que eu possua um payload válido de reserva", () => {
      return BookingFactory.createBookingPayload();
    });

    const response = await test.step('When eu enviar uma requisição "POST" para a rota "/booking"', async () => {
      return bookingService.createBooking(bookingPayload);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(response.status()).toBe(200);
    });

    const responseBody = await response.json();

    await test.step("And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso", () => {
      validateSchema(createBookingSchema, responseBody);
    });
  });

  test("Tentar criar uma reserva com payload inválido", ({ tag: ["@contrato"] }), async ({ bookingService }) => {

    const bookingPayload = await test.step("Given que eu possua um payload inválido de reserva", () => {
      return BookingFactory.createBookingPayload(12, false, "100", "OK", false, true, null);
    });

    const response = await test.step('When eu enviar uma requisição "POST" para a rota "/booking"', async () => {
      return bookingService.createBooking(bookingPayload);
    });

    await test.step("Then o código de status HTTP retornado deve ser 500", () => {
      expect(response.status()).toBe(500);
    });

    await test.step("And a resposta deve conter uma mensagem de erro", async () => {
      expect(await response.text()).toBe("Internal Server Error");
    });
  });
});