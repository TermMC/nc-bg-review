const { request } = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET api/categories", () => {
  test("200 responds with array of category objects", () => {
    return request(app)
      .get("/categories")
      .expect(200)
      .then((response) => {
        response.bodies.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  //   test("", () => {});
  //   test("", () => {});
});
