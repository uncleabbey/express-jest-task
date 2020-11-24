const request = require("supertest");
const app = require("../src/app");

const loginUrl = "/api/users/login";
const baseUrl = "/api/users";
let server = request(app);

let adminValidToken;
let invalidToken;

beforeAll(async () => {
  const adminData = {
    username: "davido",
    password: "12345678"
  }
  const nonAdminData = {
    username: "burnaboy",
    password: "12345678",
  }
  const res = await server.post(loginUrl).send(adminData)
  const res2 = await server.post(loginUrl).send(nonAdminData)
  adminValidToken = res.body.token
  invalidToken = res2.body.token
});


describe('GET /api/users/login', () => {
  test('Admin should have access to view all users', (done) => {
    server
      .get(baseUrl)
      .expect(200)
      .set("authorization", `Bearer ${adminValidToken}`)
      .end((err, res) => {
        const { users } = res.body;
        expect(Array.isArray(users)).toBe(true);
        expect(users[0]).toHaveProperty("id");
        expect(users[0]).toHaveProperty("username");
        expect(users[0]).toHaveProperty("isadmin");
        done(err)
      });
  });
  test('Non Admin Should not have access to view all users', (done) => {
    server
      .get(baseUrl)
      .expect(401)
      .set("authorization", `Bearer ${invalidToken}`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("Sorry Only Admin can perform this action");
        done(err)
      });
  });
  test('should not give access to user without token', (done) => {
        server
      .get(baseUrl)
      .expect(401)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("Access Denied: No token provided...");
        done(err)
      });
  })
  
});
