export class AuthFactory {

  static createAdminCredentials() {
    return {
      username: "admin",
      password: "password123"
    }
  }

  static createCredentials(username = "", password = "") {
    return { username, password };
  }
}