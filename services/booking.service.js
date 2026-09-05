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

  async updateBooking(bookingId, payload, authToken = null, hasAuth = true) {

    if (hasAuth) {
      const authorizationToken = authToken ? `token=${authToken}` : "Basic YWRtaW46cGFzc3dvcmQxMjM=";

      return this.request.put(`/booking/${bookingId}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          [authToken ? "Cookie" : "Authorization"]: authorizationToken
        },
        data: payload
      });
    }

    return this.request.put(`/booking/${bookingId}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      data: payload
    });
  }
}