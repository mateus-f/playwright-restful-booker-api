import { expect } from "@playwright/test";
import { test } from "../../../support/fixtures/api.fixture";
import { AuthFactory } from "../../../support/factories/auth-factory";
import { BookingFactory } from "../../../support/factories/booking-factory";

test.describe("Exclusão de reservas", () => {

  test("Excluir uma reserva com sucesso", ({ tag: ["@smoke", "@funcional"] }), async ({ bookingService, authService }) => {

    const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
      const response = await bookingService.createBooking(BookingFactory.createBookingPayload());
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("bookingid");

      return responseBody.bookingid;
    });

    const authToken = await test.step("And que eu possua uma autorização válida para exclusão", async () => {
      const response = await authService.logIn(AuthFactory.createAdminCredentials());
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("token");

      return responseBody.token;
    });

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId, "cookie", authToken);
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

    const authenticationTypes = [
      { type: "cookie" },
      { type: "basic" }
    ];

    for (const authentication of authenticationTypes) {
      const bookingId = await test.step("Given que eu possua um identificador de uma reserva existente", async () => {
        const response = await bookingService.createBooking(BookingFactory.createBookingPayload());
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty("bookingid");

        return responseBody.bookingid;
      });

      const authToken = authentication.type === "cookie"
        ? await test.step(`And que eu utilize autenticação por "${authentication.type}"`, async () => {
          const response = await authService.logIn(AuthFactory.createAdminCredentials());
          expect(response.status()).toBe(200);

          const responseBody = await response.json();
          expect(responseBody).toHaveProperty("token");

          return responseBody.token;
        }) : null;

      const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
        return bookingService.deleteBooking(bookingId, authentication.type, authToken);
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
      const response = await bookingService.createBooking(BookingFactory.createBookingPayload());
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("bookingid");

      return responseBody.bookingid;
    });

    await test.step("And que eu não informe credenciais de autenticação", () => null);

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId);
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
      const response = await authService.logIn(AuthFactory.createAdminCredentials());
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("token");

      return responseBody.token;
    });

    const deleteBookingResponse = await test.step(`When eu enviar uma requisição "DELETE" para a rota "/booking/${bookingId}"`, async () => {
      return bookingService.deleteBooking(bookingId, "cookie", authToken);
    });

    await test.step("Then o código de status HTTP retornado deve ser 405", () => {
      expect(deleteBookingResponse.status()).toBe(405);
    });
  });
})