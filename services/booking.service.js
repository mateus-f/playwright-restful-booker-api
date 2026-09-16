export class BookingService {
  constructor(request) {
    this.request = request;
  }

  buildJsonHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
  }

  buildAuthHeaders(authToken = null, hasAuth = true) {
    if (hasAuth) {
      const authValue = authToken ? `token=${authToken}` : "Basic YWRtaW46cGFzc3dvcmQxMjM=";
      return { [authToken ? "Cookie" : "Authorization"]: authValue };
    }

    return {};
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
      headers: this.buildJsonHeaders()
    });
  }

  async createBooking(payload) {
    return this.request.post("/booking", {
      headers: this.buildJsonHeaders(),
      data: payload
    });
  }

  async updateBooking(bookingId, payload, authToken = null, hasAuth = true) {
    return this.request.put(`/booking/${bookingId}`, {
      headers: {
        ...this.buildJsonHeaders(),
        ...this.buildAuthHeaders(authToken, hasAuth)
      },
      data: payload
    });
  }

  async partialUpdateBooking(bookingId, payload, authToken = null, hasAuth = true) {
    return this.request.patch(`/booking/${bookingId}`, {
      headers: {
        ...this.buildJsonHeaders(),
        ...this.buildAuthHeaders(authToken, hasAuth)
      },
      data: payload
    });
  }

  async deleteBooking(bookingId, authToken = null, hasAuth = true) {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: this.buildAuthHeaders(authToken, hasAuth)
    });
  }
}