import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";
import { BookingFactory } from "../../../factories/booking-factory";
import { AuthFactory } from "../../../factories/auth-factory";
import { validateSchema } from "../../../utils/schema-validator";
import { updateBookingSchema } from "../../../schemas/update-booking-schema";

test.describe("Atualização de uma reserva", () => {

  test.beforeEach(async ({ pingService }) => {
    const response = await pingService.getPing();
    expect(response.status()).toBe(201);
  });

  test("Atualizar uma reserva com sucesso", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
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

    const validBookingUpdatePayload = await test.step("And que eu possua um payload válido de atualização de reserva", () => {
      return BookingFactory.createBookingPayload("Matew Updated");
    });

    const updateBookingResponse = await test.step(`When eu enviar uma requisição "PUT" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.updateBooking(bookingId, validBookingUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(updateBookingResponse.status()).toBe(200);
    });

    const updateBookingResponseBody = await updateBookingResponse.json();

    await test.step("And os dados retornados devem corresponder aos dados enviados", () => {
      expect(updateBookingResponseBody.firstname).toBe(validBookingUpdatePayload.firstname);
      expect(updateBookingResponseBody.lastname).toBe(validBookingUpdatePayload.lastname);
      expect(updateBookingResponseBody.totalprice).toBe(validBookingUpdatePayload.totalprice);
      expect(updateBookingResponseBody.depositpaid).toBe(validBookingUpdatePayload.depositpaid);
      expect(updateBookingResponseBody.bookingdates.checkin).toBe(validBookingUpdatePayload.bookingdates.checkin);
      expect(updateBookingResponseBody.bookingdates.checkout).toBe(validBookingUpdatePayload.bookingdates.checkout);
      expect(updateBookingResponseBody.additionalneeds).toBe(validBookingUpdatePayload.additionalneeds);
    });
  })

  test("Validar o contrato da resposta de atualização", ({ tag: ["@contrato"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
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

    const validBookingUpdatePayload = await test.step("And que eu possua um payload válido de atualização de reserva", () => {
      return BookingFactory.createBookingPayload("Updated");
    });

    const updateBookingResponse = await test.step(`When eu enviar uma requisição "PUT" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.updateBooking(bookingId, validBookingUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 200", () => {
      expect(updateBookingResponse.status()).toBe(200);
    });

    const updateBookingResponseBody = await updateBookingResponse.json();

    await test.step("And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso", () => {
      validateSchema(updateBookingSchema, updateBookingResponseBody);
    });
  })

  test("Atualizar uma reserva utilizando autenticação suportada", ({ tag: ["@seguranca"] }), async ({ bookingService, authService }) => {

    const autheticationTypes = [
      { type: "cookie", hasAuthToken: false },
      { type: "basic", hasAuthToken: true }
    ];

    for (const authType of autheticationTypes) {
      const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
        const bookingListResponse = await bookingService.getBookings();
        expect(bookingListResponse.status()).toBe(200);

        const bookingListResponseBody = await bookingListResponse.json();
        expect(bookingListResponseBody).not.toBeNull();

        return bookingListResponseBody[0].bookingid;
      });

      const validBookingUpdatePayload = await test.step("And que eu possua um payload válido de atualização de reserva", () => {
        return BookingFactory.createBookingPayload(`Authenticated ${authType.type}`);
      });

      const authToken = !authType.hasAuthToken ? null : await test.step(`And que eu utilize autenticação por "${authType.type}"`, async () => {
        const validAuthPayload = AuthFactory.createAdminCredentials();
        const authResponse = await authService.logIn(validAuthPayload);
        expect(authResponse.status()).toBe(200);

        const authResponseBody = await authResponse.json();

        return authResponseBody.token;
      });

      const updateBookingResponse = await test.step(`When eu enviar uma requisição "PUT" para a rota "/booking/${bookingId}"`, async () => {
        return bookingService.updateBooking(bookingId, validBookingUpdatePayload, authToken);
      });

      await test.step("Then o código de status HTTP retornado deve ser 200", () => {
        expect(updateBookingResponse.status()).toBe(200);
      });

      const updateBookingResponseBody = await updateBookingResponse.json();

      await test.step("And o corpo da resposta deve conter os dados atualizados da reserva", () => {
        expect(updateBookingResponseBody.firstname).toBe(validBookingUpdatePayload.firstname);
        expect(updateBookingResponseBody.lastname).toBe(validBookingUpdatePayload.lastname);
        expect(updateBookingResponseBody.totalprice).toBe(validBookingUpdatePayload.totalprice);
        expect(updateBookingResponseBody.depositpaid).toBe(validBookingUpdatePayload.depositpaid);
        expect(updateBookingResponseBody.bookingdates.checkin).toBe(validBookingUpdatePayload.bookingdates.checkin);
        expect(updateBookingResponseBody.bookingdates.checkout).toBe(validBookingUpdatePayload.bookingdates.checkout);
        expect(updateBookingResponseBody.additionalneeds).toBe(validBookingUpdatePayload.additionalneeds);
      });
    }
  })

  test("Tentar atualizar uma reserva sem autenticação", ({ tag: ["@excecao"] }), async ({ bookingService }) => {

    const bookingId = await test.step("Given que eu possua o identificador de uma reserva existente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody[0].bookingid;
    });

    const validBookingUpdatePayload = await test.step("And que eu possua um payload válido de atualização de reserva", () => {
      return BookingFactory.createBookingPayload("NoAuth");
    });

    const authToken = await test.step("And que eu não informe credenciais de autenticação", async () => null);

    const updateBookingResponse = await test.step(`When eu enviar uma requisição "PUT" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.updateBooking(bookingId, validBookingUpdatePayload, authToken, false);
    });

    await test.step("Then o código de status HTTP retornado deve ser 403", () => {
      expect(updateBookingResponse.status()).toBe(403);
    });
  });

  test("Tentar atualizar uma reserva inexistente", ({ tag: ["@excecao"] }), async ({ bookingService, authService }) => {

    const validBookingUpdatePayload = await test.step("Given que eu possua um payload válido de atualização de reserva", () => {
      return BookingFactory.createBookingPayload("AbsentBooking");
    });

    const bookingId = await test.step("And que eu informe um identificador de reserva inexistente", async () => {
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

    const updateBookingResponse = await test.step(`When eu enviar uma requisição "PUT" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.updateBooking(bookingId, validBookingUpdatePayload, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 405", () => {
      expect(updateBookingResponse.status()).toBe(405);
    });
  })
})