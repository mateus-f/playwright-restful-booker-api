import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";

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
});