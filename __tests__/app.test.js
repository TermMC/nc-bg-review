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
        expect(response.body.categories.length).not.toBe(0);
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
  test("200 responds with unchanged review for missing inc_votes key", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
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
          votes: 5,
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
  test("400 returns bad request msg for wrong data type sent to update on correct key", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "beef wellington" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });
});

describe("GET /api/reviews?query", () => {
  test("200 responds with an array of first 10 reviews when no query provided", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeInstanceOf(Array);
        expect(response.body.reviews.length).toBe(13);

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

        expect(response.body.reviews.length).not.toBe(0);
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

  test("200 responds with empty array when category string provided for category with no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toHaveLength(0);
      });
  });
  test("404 responds with bad request message when non-existent category provided", () => {
    return request(app)
      .get("/api/reviews?category=gibberish")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Search Term");
      });
  });
  test("200 responds with array correctly sorted when sorted by date in desc order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 responds with array correctly sorted in desc order when given sort query ", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("designer", {
          descending: true,
        });
      });
  });
  test("400 responds with bad request msg when given incorrect sort term", () => {
    return request(app)
      .get("/api/reviews?sort_by=propaganda")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
  test("200 responds with array sorted in asc order when given order query", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("400 responds with bad request msg when given incorrect order term", () => {
    return request(app)
      .get("/api/reviews?order=the_phoenix")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200 returns array of comments for given review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments.length).toBe(3);
        response.body.comments.forEach((comment) => {
          return expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: 2,
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("400 bad request for review_id NaN", () => {
    return request(app)
      .get("/api/reviews/thirsty_witch/comments")
      .expect(400)
      .then((response) =>
        expect(response.body.msg).toBe("Invalid Search Term")
      );
  });
  test("404 not found for review_id not in range", () => {
    return request(app).get("/api/reviews/9999999/comments").expect(404);
    // .then((response) => expect(response.body.msg).toBe("Review not found"));
  });
  test("200 returns empty array for review with no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(0);
        expect(res.body.comments).toBeInstanceOf(Array);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201 responds with created comment object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "dav3rid", body: "It's like BEPIS in my body" })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          author: "dav3rid",
          body: "It's like BEPIS in my body",
          comment_id: 7,
          created_at: expect.any(String),
          review_id: 1,
          votes: 0,
        });
      });
  });
  test("404 not found for review_id out of range", () => {
    return request(app)
      .post("/api/reviews/999999/comments")
      .send({ username: "dav3rid", body: "It's like BEPIS in my body" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Search Term");
      });
  });
  test("400 bad request for review_id NaN", () => {
    return request(app)
      .post("/api/reviews/beanan/comments")
      .send({ username: "dav3rid", body: "It's like BEPIS in my body" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
  test("400 bad request for not having correct keys on object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ author: "dav3rid", body: "It's like BEPIS in my body" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Data Provided");
      });
  });
  test("404 for username does not exist", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "Not_a_Real_Username",
        body: "It's like BEPIS in my body",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Search Term");
      });
  });
  test("201 for comment object with additional keys, additional keys are ignored  ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        created_at: 356247,
        username: "dav3rid",
        body: "It's like BEPIS in my body",
        second_extra_key: "nonsense",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          author: "dav3rid",
          body: "It's like BEPIS in my body",
          comment_id: 7,
          created_at: expect.any(String),
          review_id: 1,
          votes: 0,
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204 responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404 not found responds with comment not found for id out of range", () => {
    return request(app)
      .delete("/api/comments/99999999")
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("Comment Not Found"));
  });

  test("400 bad request for id wrong data type", () => {
    return request(app)
      .delete("/api/comments/omelette")
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("Invalid Request"));
  });
});

describe("GET /api", () => {
  test("200 responds with all available endpoint on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            queries: ["category", "sort_by", "order"],
            exampleResponse: {
              reviews: [
                {
                  title: "One Night Ultimate Werewolf",
                  designer: "Akihisa Okui",
                  owner: "happyamy2016",
                  review_img_url:
                    "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  category: "hidden-roles",
                  created_at: 1610964101251,
                  votes: 5,
                },
              ],
            },
          },
          "POST /api/reviews": {
            description:
              "creates a new review, accepts review object with the properties owner, title, review_body, designer and category, responds with the newly added review object",
            "request body": {
              owner: "dav3rid",
              title: "Splendor",
              review_body: "The only real way to meet the great Sheik Ullah",
              designer: "A.N. Other",
              category: "euro game",
            },
            "example response": {
              review_id: 15,
              owner: "dav3rid",
              title: "Splendor",
              review_body: "The only real way to meet the great Sheik Ullah",
              designer: "A.N. Other",
              category: "euro game",
              votes: 0,
              created_at: 1610964101251,
              comment_count: 0,
            },
          },
          "GET /api/reviews/:review_id": {
            description: "serves a review object",
            exampleResponse: {
              review: {
                review_id: 3,
                title: "One Night Ultimate Werewolf",
                designer: "Akihisa Okui",
                owner: "happyamy2016",
                review_img_url:
                  "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                category: "hidden-roles",
                created_at: 1610964101251,
                votes: 5,
                comment_count: 3,
              },
            },
          },
          "PATCH /api/reviews/:review_id": {
            description:
              "updates the review with keys from the request body, currently only accepts inc_votes, responds with the updated review",
            "request body": { inc_votes: 1 },
            "example response": {
              review: {
                title: "One Night Ultimate Werewolf",
                designer: "Akihisa Okui",
                owner: "happyamy2016",
                review_img_url:
                  "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                category: "hidden-roles",
                created_at: 1610964101251,
                votes: 6,
              },
            },
          },
          "GET /api/reviews/:review_id/comments": {
            description: "serves an array of all comments on review",
            exampleResponse: {
              comments: [
                {
                  comment_id: 5,
                  body: "My dog loved this game too!",
                  votes: 13,
                  author: "mallionaire",
                  review_id: 3,
                  created_at: 1610964545410,
                },
              ],
            },
          },
          "POST /api/reviews/:review_id/comments": {
            description:
              "creates an new comment on the review, accepts comment object with valid username and body, responds with the created comment object",
            "request body": {
              username: "dav3rid",
              body: "This game was mad to the max",
            },
            "example response": {
              username: "dav3rid",
              body: "This game was mad to the max",
              comment_id: 10,
            },
          },
          "DELETE /api/comments/:comment_id": {
            description: "deletes the comment",
            "example response":
              "Status 204 - No body is returned by this endpoint",
          },
          "PATCH /api/comments/:comment_id": {
            description:
              "updates the comment with keys from the request body, currently only accepts inc_votes, responds with the updated comment",
            "request body": { inc_votes: 1 },
            "example response": {
              comment_id: 5,
              body: "My dog loved this game too!",
              votes: 14,
              author: "mallionaire",
              review_id: 3,
              created_at: 1610964545410,
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            "example response": {
              users: [
                {
                  username: "dav3rid",
                  name: "dave",
                  avatar_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                },
              ],
            },
          },
          "GET /api/users/:username": {
            description: "serves a user object",
            "example response": {
              username: "dav3rid",
              name: "dave",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            },
          },
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200 responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) =>
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          )
        );
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 responds with correct user object", () => {
    return request(app)
      .get("/api/users/dav3rid")
      .expect(200)
      .then((response) => {
        expect(response.body.user).toEqual({
          username: "dav3rid",
          name: "dave",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });
  test("404 not found for user not in db", () => {
    return request(app)
      .get("/api/users/123456")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User Could Not Be Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200 responds with the updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: "I loved this game too!",
            votes: 17,
            author: "bainesface",
            review_id: 2,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("404 not found responds with comment not found for id out of range", () => {
    return request(app)
      .patch("/api/comments/99999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("Comment Not Found"));
  });

  test("400 bad request for id wrong data type", () => {
    return request(app)
      .patch("/api/comments/bantam")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("Invalid Request"));
  });

  test("400 returns bad request msg for wrong data type sent to update on correct key", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "beef wellington" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });

  test("200 missing inc_votes returns unchanged comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send("beef wellington")
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: "I loved this game too!",
            votes: 16,
            author: "bainesface",
            review_id: 2,
            created_at: expect.any(String),
          })
        );
      });
  });
});

describe("POST /api/reviews", () => {
  test("201 responds with the newly added review", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "mallionaire",
        title: "Century: The Spiciest Road You Can Walk Down",
        review_body:
          "How did you get all this spice? Why is it so cubular? How will you get rid of it? Why don't you have more of those dam upgrade cards?",
        designer: "Josh Homme",
        category: "euro game",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.review).toEqual(
          expect.objectContaining({
            owner: "mallionaire",
            title: "Century: The Spiciest Road You Can Walk Down",
            review_body:
              "How did you get all this spice? Why is it so cubular? How will you get rid of it? Why don't you have more of those dam upgrade cards?",
            designer: "Josh Homme",
            category: "euro game",
            review_id: expect.any(Number),
            review_img_url: expect.any(String),
            votes: 0,
            comment_count: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400 bad request for object with keys missing", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "mallionaire",
        babaganoosh: "Century: The Spiciest Road You Can Walk Down",
        review_body:
          "How did you get all this spice? Why is it so cubular? How will you get rid of it? Why don't you have more of those dam upgrade cards?",
        designer: "Josh Homme",
        category: "euro game",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });
  test("201 for comment object with additional keys, additional keys are ignored  ", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        owner: "mallionaire",
        title: "Century: The Spiciest Road You Can Walk Down",
        review_body:
          "How did you get all this spice? Why is it so cubular? How will you get rid of it? Why don't you have more of those dam upgrade cards?",
        designer: "Josh Homme",
        category: "euro game",
        extra_key: "Toads are for everyone.",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.review).toEqual(
          expect.objectContaining({
            owner: "mallionaire",
            title: "Century: The Spiciest Road You Can Walk Down",
            review_body:
              "How did you get all this spice? Why is it so cubular? How will you get rid of it? Why don't you have more of those dam upgrade cards?",
            designer: "Josh Homme",
            category: "euro game",
            review_id: expect.any(Number),
            review_img_url: expect.any(String),
            votes: 0,
            comment_count: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400 bad request for non-object update provided", () => {
    return request(app)
      .post("/api/reviews")
      .send("I'm the wrong data type, I'm not even an object")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Update Provided");
      });
  });
});
