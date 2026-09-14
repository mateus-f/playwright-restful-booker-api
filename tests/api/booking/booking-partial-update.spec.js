import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";
import { BookingFactory } from "../../../factories/booking-factory";
import { AuthFactory } from "../../../factories/auth-factory";
import { validateSchema } from "../../../utils/schema-validator";
import { partialUpdateBookingSchema } from "../../../schemas/partial-update-booking-schema";

test.describe("Atualização parcial de reservas", () => {

  test.beforeEach(async ({ pingService }) => {
    const response = await pingService.getPing();
    expect(response.status()).toBe(201);
  });

  test("Atualizar parcialmente uma reserva com sucesso", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody[0].bookingid;
    });

    const bookingResponse = await bookingService.getBookingById(bookingId);
    const bookingResponseBody = await bookingResponse.json();

    const authToken = await test.step("And que eu possua um token de autenticação válido", async () => {
      const validAuthPayload = AuthFactory.createAdminCredentials();
      const authResponse = await authService.logIn(validAuthPayload);
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();

      return authResponseBody.token;
    });

    const validBookingPartialUpdatePayload = await test.step("And que eu possua um payload parcial válido de reserva", () => {
      return BookingFactory.createPartialBookingPayload();
    });

    const partialUpdateBookingResponse = await test.step(`When eu enviar uma requisição "PATCH" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.partialUpdateBooking(bookingId, validBookingPartialUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(partialUpdateBookingResponse.status()).toBe(200);
    });

    const partialUpdateBookingResponseBody = await partialUpdateBookingResponse.json();

    await test.step("And os campos enviados devem estar atualizados na resposta", () => {
      expect(partialUpdateBookingResponseBody.firstname).toBe(validBookingPartialUpdatePayload.firstname);
      expect(partialUpdateBookingResponseBody.totalprice).toBe(validBookingPartialUpdatePayload.totalprice);
    });

    await test.step("And os campos não enviados devem ser preservados", () => {
      expect(partialUpdateBookingResponseBody.lastname).toBe(bookingResponseBody.lastname);
      expect(partialUpdateBookingResponseBody.depositpaid).toBe(bookingResponseBody.depositpaid);
      expect(partialUpdateBookingResponseBody.bookingdates.checkin).toBe(bookingResponseBody.bookingdates.checkin);
      expect(partialUpdateBookingResponseBody.bookingdates.checkout).toBe(bookingResponseBody.bookingdates.checkout);
      expect(partialUpdateBookingResponseBody.additionalneeds).toBe(bookingResponseBody.additionalneeds);
    });
  })

  test("Validar o contrato da resposta de atualização parcial", ({ tag: ["@contrato"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody[0].bookingid;
    });

    const authToken = await test.step("And que eu possua um token de autenticação válido", async () => {
      const validAuthPayload = AuthFactory.createAdminCredentials();
      const authResponse = await authService.logIn(validAuthPayload);
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();

      return authResponseBody.token;
    });

    const validBookingPartialUpdatePayload = await test.step("And que eu possua um payload parcial válido de reserva", () => {
      return BookingFactory.createPartialBookingPayload();
    });

    const partialUpdateBookingResponse = await test.step(`When eu enviar uma requisição "PATCH" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.partialUpdateBooking(bookingId, validBookingPartialUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(partialUpdateBookingResponse.status()).toBe(200);
    });

    const partialUpdateBookingResponseBody = await partialUpdateBookingResponse.json();

    await test.step("And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso", () => {
      validateSchema(partialUpdateBookingSchema, partialUpdateBookingResponseBody);
    });
  })

  test("Tentar atualizar parcialmente uma reserva sem autenticação", ({ tag: ["@seguranca"] }), async ({ bookingService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody[0].bookingid;
    });

    const validBookingPartialUpdatePayload = await test.step("And que eu possua um payload parcial válido de reserva", () => {
      return BookingFactory.createPartialBookingPayload();
    });

    const authToken = await test.step("And que eu não informe credenciais de autenticação", async () => null);

    const partialUpdateBookingResponse = await test.step(`When eu enviar uma requisição "PATCH" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.partialUpdateBooking(bookingId, validBookingPartialUpdatePayload, authToken, false);
    });

    await test.step("Then o código de status HTTP retornado deve ser 403", () => {
      expect(partialUpdateBookingResponse.status()).toBe(403);
    });
  })

  test("Tentar atualizar parcialmente uma reserva inexistente", ({ tag: ["@excecao"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu informe um identificador de reserva inexistente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody.at(-1).bookingid + 100;
    });

    const authToken = await test.step("And que eu possua um token de autenticação válido", async () => {
      const validAuthPayload = AuthFactory.createAdminCredentials();
      const authResponse = await authService.logIn(validAuthPayload);
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();

      return authResponseBody.token;
    });

    const validBookingPartialUpdatePayload = await test.step("And que eu possua um payload parcial válido de reserva", () => {
      return BookingFactory.createPartialBookingPayload();
    });

    const partialUpdateBookingResponse = await test.step(`When eu enviar uma requisição "PATCH" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.partialUpdateBooking(bookingId, validBookingPartialUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 403", () => {
      expect(partialUpdateBookingResponse.status()).toBe(405);
    });
  })
})