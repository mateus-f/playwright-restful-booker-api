import { expect } from "@playwright/test";

export class PingService {
  constructor(request) {
    this.request = request;
    this.response = null;
    this.responseBody = null;
  }
}