export class BookingService {
  constructor(request) {
    this.request = request;
  }

  async getBookings() {
    return await this.request.get("/booking");
  }
}