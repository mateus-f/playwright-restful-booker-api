export class AuthService {
  constructor(request) {
    this.request = request;
  }

  async logIn(payload) {
    return await this.request.post("/auth", {
      data: payload
    });
  }
}