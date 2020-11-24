const request = require("supertest");
const app = require("../src/app");

const baseUrl = "/api/users/login";
let server = request(app);


describe('POST /api/users/login', () => {
  test('should return token for a successful login', (done) => {
    const data = {
      username: "davido",
      password: "12345678"
    };
    server
      .post(baseUrl)
      .send(data)
      .expect(201)
      .end((err, res) => {
        const { message, token } = res.body;
        expect(typeof message).toBe("string");
        expect(message).toBe("Login is successful");
        expect(typeof token).toBe("string");
        done(err);
      })
  });
  test('should return error for invalid input', (done) => {
    const data = {
      username: "",
      password: "12345678"
    };
    server
      .post(baseUrl)
      .send(data)
      .expect(400)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(typeof error).toBe("string");
        done(err);
      });
  });
  test('should return error for invalid password', (done) => {
    const data = {
      username: "davido",
      password: "1234567"
    };
    server
      .post(baseUrl)
      .send(data)
      .expect(400)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(typeof error).toBe("string");
        expect(error).toBe("Invalid Username or Password");
        done(err);
      });
  });
  test('should return error for unregistered username', (done) => {
    const data = {
      username: "david",
      password: "12345678"
    };
    server
      .post(baseUrl)
      .send(data)
      .expect(400)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(typeof error).toBe("string");
        expect(error).toBe("Invalid Username or Password");
        done(err);
      });
  });
  
});
