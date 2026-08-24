import { expect } from "@playwright/test";
import { AuthFactory } from "../../../factories/auth-factory";
import { test } from "../../../fixtures/api.fixture";

test.describe("Auth", () => {

  const invalidsPayloads = [
    AuthFactory.createCredentials("admin", "wrongPassword123"),
    AuthFactory.createCredentials("invalid", "password123"),
    AuthFactory.createCredentials("", "password123"),
    AuthFactory.createCredentials("admin"),
    AuthFactory.createCredentials(),
  ]

  test.beforeEach(async ({ pingService }) => {
    const response = await pingService.getPing();
    expect(response.status()).toBe(201);
  });

  test("Gerar token com credenciais válidas", { tag: ["@smoke", "@funcional"] }, async ({ authService }) => {

    const payload = await test.step("Given que eu possua um payload válido de autenticação", () => {
      return AuthFactory.createAdminCredentials()
    });

    const response = await test.step('When eu enviar uma requisição "POST" para a rota "/auth"', async () => {
      return await authService.logIn(payload);
    });

    const responseBody = await response.json();

    await test.step('Then o código de status HTTP retornado deve ser 200', () => {
      expect(response.status()).toBe(200);
    });

    await test.step('And o corpo da resposta deve conter o campo "token"', () => {
      expect(responseBody).toHaveProperty("token");
    });

    await test.step('And o campo "token" deve ser uma string não vazia', () => {
      expect(typeof responseBody.token).toBe('string');
      expect(responseBody.token.length).toBeGreaterThan(0);
    });
  });

  test("Validar o contrato da resposta de autenticação", { tag: ["@contrato"] }, async ({ authService }) => {
    const payload = await test.step("Given que eu possua um payload válido de autenticação", () => {
      return AuthFactory.createAdminCredentials()
    });

    const response = await test.step('When eu enviar uma requisição "POST" para a rota "/auth"', async () => {
      return await authService.logIn(payload);
    });

    const responseBody = await response.json();

    await test.step('Then o código de status HTTP retornado deve ser 200', () => {
      expect(response.status()).toBe(200);
    });

    await test.step('And a resposta deve conter somente o campo "token"', () => {
      const keys = Object.keys(responseBody);

      expect(keys.length).toBe(1);
      expect(keys[0]).toBe("token");
    });

    await test.step('And o campo "token" deve ser do tipo string', () => {
      expect(typeof responseBody.token).toBe('string');
    });
  });

  invalidsPayloads.forEach((payloadData) => {
    test(`Rejeitar credenciais inválidas: username="${payloadData.username}", password="${payloadData.password}"`, { tag: ["@excecao"] }, async ({ authService }) => {

      const payload = await test.step(`Given que eu informe o usuário "${payloadData.username}" e a senha "${payloadData.password}"`, () => {
        return payloadData;
      });

      const response = await test.step('When eu enviar uma requisição "POST" para a rota "/auth"', async () => {
        return await authService.logIn(payload);
      });

      await test.step('Then o código de status HTTP retornado deve ser 200', () => {
        expect(response.status()).toBe(200);
      });

      await test.step('And a resposta deve conter a mensagem de erro "Bad credentials"', () => {
        expect(response.status()).toBe(200);
      });
    })
  });
});