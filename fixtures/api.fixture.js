import { test as base, expect } from "@playwright/test"
import { AuthService } from "../services/auth.service";
import { BookingService } from "../services/booking.service";
import { PingService } from "../services/ping.service";

export const test = base.extend({

  authService: async ({ request }, use) => {
    await use(new AuthService(request));
  },

  bookingService: async ({ request }, use) => {
    await use(new BookingService(request));
  },

  pingService: async ({ request }, use) => {
    await use(new PingService(request));
  }
});