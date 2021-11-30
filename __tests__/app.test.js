const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200 responds with array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        response.body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200 returns correct review object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(String),
          })
        );
      });
  });
  test("404 returns bad request for id out of range", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid review ID");
      });
  });
  test("400 returns bad request for id wrong data type", () => {
    return request(app)
      .get("/api/reviews/junk")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: responds with an updated review object for increasing votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .expect((response) => {
        expect(response.body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 6,
        });
      });
  });
  test("200: responds with an updated review object for decreasing votes", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -2 })
      .expect(200)
      .expect((response) => {
        expect(response.body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String),
          votes: 3,
        });
      });
  });
  test("404 returns bad request msg for id out of range", () => {
    return request(app)
      .patch("/api/reviews/999999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid review ID");
      });
  });
  test("400 returns bad request msg for id wrong data type", () => {
    return request(app)
      .patch("/api/reviews/junk")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
  test("400 returns bad request msg for wrong data type sent to update ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "beef wellington" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });
  test("400 returns bad request msg for wrong data type sent to update ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send("beef wellington")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });
});

describe("GET /api/reviews?query", () => {
  test("200 responds with an array of reviews when no query provided", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeInstanceOf(Array);
        response.body.reviews.forEach((review) => {
          return expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("200 responds with a array filtered by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeInstanceOf(Array);
        response.body.reviews.forEach((review) => {
          return expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: "dexterity",
              owner: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("404 responds with bad request msg when invalid category string provided", () => {
    return request(app)
      .get("/api/reviews?category=jibberish")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No reviews of that category");
      });
  });
  test("400 responds with bad request msg when non-string category provided", () => {
    return request(app)
      .get("/api/reviews?category=12345")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});
