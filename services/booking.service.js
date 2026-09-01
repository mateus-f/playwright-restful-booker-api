export class BookingService {
  constructor(request) {
    this.request = request;
  }

  async getBookings() {
    return this.request.get("/booking");
  }

  async getBookingsWithParams(searchParam) {
    return this.request.get("/booking", {
      params: searchParam
    });
  }

  async getBookingById(id) {
    return this.request.get(`/booking/${id}`, {
      headers: {
        "Accept": "application/json"
      }
    });
  }

  async createBooking(payload) {
    return this.request.post("/booking", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      data: payload
    });
  }
}