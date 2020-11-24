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

describe('DELETE /api/users', () => {
  test('admin should delete user', (done) => {
    server
      .delete(`${baseUrl}/5`)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(200)
      .end((err, res) => {
        const {message} = res.body;
        expect(message).toBe("user deleted successfully");
        done(err)
      })
  })
    test("Should return error for unregistered user", (done) => {
    server
      .delete(`${baseUrl}/10`)
      .set("authorization", `Bearer ${adminValidToken}`)
      .expect(404)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status).toBe("error");
        expect(error).toBe("User not found");
        done(err);
      });
  });
});
