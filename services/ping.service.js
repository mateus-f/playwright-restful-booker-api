export class PingService {
  constructor(request) {
    this.request = request;
  }

  async getPing() {
    return await this.request.get("/ping");
  }
}