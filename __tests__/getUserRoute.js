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
    username: "burnaboy",
    password: "12345678",
  };
  const res = await server.post(loginUrl).send(adminData);
  const res2 = await server.post(loginUrl).send(nonAdminData);
  adminValidToken = res.body.token;
  nonAdminToken = res2.body.token;
});

describe("GET /api/users/:id", () => {
  test("Admin Should get details", (done) => {
    server
      .get(`${baseUrl}/3`)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(200)
      .end((err, res) => {
        const { user } = res.body;
        expect(typeof user).toBe("object");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("isadmin");
        done(err);
      });
  });
  test("Should return error for unregistered user", (done) => {
    server
      .get(`${baseUrl}/10`)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(404)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("User not found");
        done(err);
      });
  });
  test("User should get their own details", (done) => {
    server
      .get(`${baseUrl}/3`)
      .set("authorization", `Bearer ${nonAdminToken}`)
      .expect(200)
      .end((err, res) => {
        const { user } = res.body;
        expect(typeof user).toBe("object");
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("isadmin");
        done(err);
      });
  });
  test("Non admin users should not get another users details", (done) => {
    server
      .get(`${baseUrl}/1`)
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
    server
      .get(`${baseUrl}/1`)
      .expect(401)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("Access Denied: No token provided...");
        done(err);
      });
  });
});
