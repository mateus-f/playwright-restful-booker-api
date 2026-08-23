import { expect } from "@playwright/test";

export class BookingService
{
  constructor(request){
    this.request = request;
    this.response = null;
    this.responseBody = null;
  }
}