import { expect } from "@playwright/test";

export class AuthService {
  constructor(request) {
    this.request = request;
    this.response = null;
    this.responseBody = null;
  }
}