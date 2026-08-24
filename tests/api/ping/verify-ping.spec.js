import { test } from "../../../fixtures/api.fixture";

test.describe("Ping", () => {

  test("Verificar a disponibilidade da API", { tag: ["@smoke", "@funcional"] }, async ({ pingService }) => {
    await pingService.verifyPing();
  });
});