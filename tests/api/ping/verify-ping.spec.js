import { expect } from "@playwright/test";
import { test } from "../../../fixtures/api.fixture";

test.describe("Ping", () => {

  test("Verificar a disponibilidade da API", { tag: ["@smoke", "@funcional"] }, async ({ pingService }) => {

    await test.step('Given que a API Restful Booker esteja acessível', () => {
      expect(pingService).toBeDefined();
    });

    const response = await test.step('When eu enviar uma requisição "GET" para a rota "/ping"', async () => {
      return await pingService.getPing();
    });

    await test.step("Then o código de status HTTP retornado deve ser 201", () => {
      expect(response.status()).toBe(201);
    });
  });
});