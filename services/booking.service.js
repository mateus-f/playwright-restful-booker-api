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

  buildAuthHeaders(authType, authToken = null) {
    if (authType === "cookie") {
      return {
        "Cookie": `token=${authToken}`,
      }
    }

    if (authType === "basic") {
      return {
        "Authorization": "Basic YWRtaW46cGFzc3dvcmQxMjM=",
      }
    }
    if (authType === "none") {
      return {};
    }

    throw new Error(`Tipo de autenticação inválido: ${authType}`);
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

  async updateBooking(bookingId, payload, authType = "none", authToken = null) {
    return this.request.put(`/booking/${bookingId}`, {
      headers: {
        ...this.buildJsonHeaders(),
        ...this.buildAuthHeaders(authType, authToken)
      },
      data: payload
    });
  }

  async partialUpdateBooking(bookingId, payload, authType = "none", authToken = null) {
    return this.request.patch(`/booking/${bookingId}`, {
      headers: {
        ...this.buildJsonHeaders(),
        ...this.buildAuthHeaders(authType, authToken)
      },
      data: payload
    });
  }

  async deleteBooking(bookingId, authType = "none", authToken = null) {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: this.buildAuthHeaders(authType, authToken)
    });
  }
}