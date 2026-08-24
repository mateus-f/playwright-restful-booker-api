import { expect } from "@playwright/test";

export class PingService {
  constructor(request) {
    this.request = request;
    this.response = null;
  }

  async validatePing() {
    expect(this.response.status()).toBe(201);
  }

  async verifyPing() {
    this.response = await this.request.get("/ping");
    await this.validatePing();
  }
}