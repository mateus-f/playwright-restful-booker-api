import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";
import { AuthFactory } from "../../../factories/auth-factory";
import { BookingFactory } from "../../../factories/booking-factory";

test.describe("Exclusão de reservas", () => {

  test.beforeEach(async ({ pingService }) => {
    const response = await pingService.getPing();
    expect(response.status()).toBe(201);
  });

  test("Excluir uma reserva com sucesso", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const createBookingResponse = await bookingService.createBooking(BookingFactory.createBookingPayload());
      expect(createBookingResponse.status()).toBe(200);

      const createBookingResponseBody = await createBookingResponse.json();
      expect(createBookingResponseBody).toHaveProperty("bookingid");

      return createBookingResponseBody.bookingid;
    });

    const authToken = await test.step("And que eu possua uma autorização válida para exclusão", async () => {
      const validAuthPayload = AuthFactory.createAdminCredentials();
      const authResponse = await authService.logIn(validAuthPayload);
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();

      return authResponseBody.token;
    });

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 201", () => {
      expect(deleteBookingResponse.status()).toBe(201);
    });

    await test.step("And a reserva deve ser excluída com sucesso", async () => {
      const checkBookingResponse = await bookingService.getBookingById(bookingId);
      expect(checkBookingResponse.status()).toBe(404);
    });
  });

  test("Excluir uma reserva utilizando autenticação suportada", ({ tag: ["@seguranca"] }), async ({ bookingService, authService }) => {

    const autheticationTypes = [
      { type: "cookie", hasAuthToken: false },
      { type: "basic", hasAuthToken: true }
    ];

    for (const authType of autheticationTypes) {
      const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
        const createBookingResponse = await bookingService.createBooking(BookingFactory.createBookingPayload());
        expect(createBookingResponse.status()).toBe(200);

        const createBookingResponseBody = await createBookingResponse.json();
        expect(createBookingResponseBody).toHaveProperty("bookingid");

        return createBookingResponseBody.bookingid;
      });

      const authToken = !authType.hasAuthToken ? null : await test.step(`And que eu utilize autenticação por "${authType.type}"`, async () => {
        const validAuthPayload = AuthFactory.createAdminCredentials();
        const authResponse = await authService.logIn(validAuthPayload);
        expect(authResponse.status()).toBe(200);

        const authResponseBody = await authResponse.json();

        return authResponseBody.token;
      });

      const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
        return bookingService.deleteBooking(bookingId, authToken);
      });

      await test.step("Then o código de status HTTP retornado deve ser 201", () => {
        expect(deleteBookingResponse.status()).toBe(201);
      });

      await test.step("And a reserva deve ser excluída com sucesso", async () => {
        const checkBookingResponse = await bookingService.getBookingById(bookingId);
        expect(checkBookingResponse.status()).toBe(404);
      });
    }
  });

  test("Tentar excluir uma reserva sem autenticação", ({ tag: ["@excecao"] }), async ({ bookingService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const createBookingResponse = await bookingService.createBooking(BookingFactory.createBookingPayload());
      expect(createBookingResponse.status()).toBe(200);

      const createBookingResponseBody = await createBookingResponse.json();
      expect(createBookingResponseBody).toHaveProperty("bookingid");

      return createBookingResponseBody.bookingid;
    });

    const authToken = await test.step("And que eu não informe credenciais de autenticação", () => null);

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId, authToken, false);
    });

    await test.step("Then o código de status HTTP retornado deve ser 403", () => {
      expect(deleteBookingResponse.status()).toBe(403);
    });
  });

  test("Tentar excluir uma reserva inexistente", ({ tag: ["@excecao"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva inexistente", async () => {
      const bookingListResponse = await bookingService.getBookings();
      expect(bookingListResponse.status()).toBe(200);

      const bookingListResponseBody = await bookingListResponse.json();
      expect(bookingListResponseBody).not.toBeNull();

      return bookingListResponseBody.at(-1).bookingid + 100;
    });

    const authToken = await test.step("And que eu possua uma autorização válida para exclusão", async () => {
      const validAuthPayload = AuthFactory.createAdminCredentials();
      const authResponse = await authService.logIn(validAuthPayload);
      expect(authResponse.status()).toBe(200);

      const authResponseBody = await authResponse.json();

      return authResponseBody.token;
    });

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId, authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 405", () => {
      expect(deleteBookingResponse.status()).toBe(405);
    });
  });
})