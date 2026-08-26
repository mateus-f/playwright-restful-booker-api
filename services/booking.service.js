export class BookingService {
  constructor(request) {
    this.request = request;
  }

  async getBookings() {
    return await this.request.get("/booking");
  }

  async getBookingsWithParams(searchParam) {
    return await this.request.get("/booking", {
      params: searchParam
    });
  }

  async getBookingById(id) {
    return await this.request.get(`/booking/${id}`, {
      headers: {
        "accept": "application/json"
      }
    });
  }
}