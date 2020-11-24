const request = require("supertest");
const app = require("../src/app");

const baseUrl = "/api/users";
let server = request(app);

describe("POST /api/users", () => {
  test("it adds users to database", (done) => {
    const data = {
      username: "nneka",
      password: "12345678",
      isAdmin: false
    }

    server
      .post(baseUrl)
      .send(data)
      .expect(201)
      .end((err, res) => {
        const { message, user, token } = res.body;
        const { username, isadmin } = user;
        expect(typeof message).toBe("string")
        expect(message).toBe("User added successfully")
        expect(typeof user).toBe("object");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(username).toBe("nneka");
        expect(user).toHaveProperty("isadmin");
        expect(isadmin).toBe(false);
        expect(typeof token).toBe("string");
        done(err);
      });
  });

  test('It returns error for invalid input', (done) => {
    const data = {
      username: "",
      password: "12345678",
      isAdmin: false
    }

    server
      .post(baseUrl)
      .send(data)
      .expect(400)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(typeof error).toBe("string");
        done(err)
      });
  });
  
  test('It return error if user has registered before', (done) => {
    const data = {
      username: "davido",
      password: "12345678",
      isAdmin: true
    }
    server
    .post(baseUrl)
    .send(data)
    .expect(400)
    .end((err, res) => {
      const { status, error } = res.body;
      expect(status).toBe("error");
      expect(typeof error).toBe("string");
      expect(error).toBe("User already exist");
      done(err)
    });
  });
});

