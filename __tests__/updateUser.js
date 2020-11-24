const request = require("supertest");
const app = require("../src/app");

const loginUrl = "/api/users/login";
const baseUrl = "/api/users";
let server = request(app);

let adminValidToken;
let nonAdminToken;

beforeAll(async () => {
  const adminData = {
    username: "davido",
    password: "12345678",
  };
  const nonAdminData = {
    username: "fireboy",
    password: "12345678",
  };
  const res = await server.post(loginUrl).send(adminData);
  const res2 = await server.post(loginUrl).send(nonAdminData);
  adminValidToken = res.body.token;
  nonAdminToken = res2.body.token;
});

describe("PATCH /api/user", () => {
  test("Admin should update user details", (done) => {
    const data = {
      username: "wizkidEditted",
      password: "123456789",
    };
    server
      .patch(`${baseUrl}/1`)
      .send(data)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(200)
      .end((err, res) => {
        const { message, user } = res.body;
        expect(message).toBe("user updated successfully");
        expect(typeof user).toBe("object");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("isadmin");
        done(err);
      });
  });
  test("Owner should update their details", (done) => {
    const data = {
      username: "fireboydml",
      password: "123456789",
    };
    server
      .patch(`${baseUrl}/4`)
      .send(data)
      .set("authorization", `Bearer ${nonAdminToken}`)
      .expect(200)
      .end((err, res) => {
        const { message, user } = res.body;
        expect(message).toBe("user updated successfully");
        expect(typeof user).toBe("object");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("isadmin");
        done(err);
      });
  });
  test("Should return error for unregistered user", (done) => {
    const data = {
      username: "fireboydml",
      password: "123456789",
    };
    server
      .patch(`${baseUrl}/10`)
      .send(data)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(404)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("User not found");
        done(err);
      });
  });
  test("Non admin users should not get another users details", (done) => {
    const data = {
      username: "fireboydml",
      password: "123456789",
    };
    server
      .patch(`${baseUrl}/1`)
      .send(data)
      .set("authorization", `Bearer ${nonAdminToken}`)
      .expect(401)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe(
          "sorry Only owner or admin can perform this operation"
        );
        done(err);
      });
  });
  test("should not give access to user without token", (done) => {
    const data = {
      username: "fireboydml",
      password: "123456789",
    };
    server
      .patch(`${baseUrl}/1`)
      .send(data)
      .expect(401)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("Access Denied: No token provided...");
        done(err);
      });
  });
});
