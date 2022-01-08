const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return (
    db
      //drop tables
      .query("DROP TABLE IF EXISTS comments")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS reviews");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS categories").then(() => {});
      })
      //create table categories
      .then(() => {
        return db.query(`CREATE TABLE categories (
        slug VARCHAR(100) PRIMARY KEY,
        description VARCHAR(300)
      ) `);
      })
      //create table users
      .then(() => {
        return db.query(`CREATE TABLE users (
        username VARCHAR(200) PRIMARY KEY,
        avatar_url TEXT,
        name VARCHAR(250) NOT NULL
      )`);
      })
      //create table reviews
      .then(() => {
        return db.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(250),
        review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(100) REFERENCES categories(slug) NOT NULL,
        owner VARCHAR(200) REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      })
      //create table comments
      .then(() => {
        return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(200) REFERENCES users(username) NOT NULL,
        review_id INT REFERENCES reviews(review_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL
      )`);
      })
      //insert categories
      .then(() => {
        const formattedCategoryData = categoryData.map((category) => {
          return [category.slug, category.description];
        });
        const categoryDataInsertionString = format(
          `INSERT INTO categories (slug, description) VALUES %L RETURNING *`,
          formattedCategoryData
        );
        return db.query(categoryDataInsertionString);
      })
      //insert users
      .then(() => {
        const formattedUserData = userData.map((user) => {
          return [user.username, user.avatar_url, user.name];
        });
        const userDataInsertionString = format(
          `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *`,
          formattedUserData
        );
        return db.query(userDataInsertionString);
      })
      //insert reviews
      .then(() => {
        const formattedReviewData = reviewData.map((review) => {
          return [
            review.title,
            review.designer,
            review.owner,
            review.review_img_url,
            review.review_body,
            review.category,
            review.created_at,
            review.votes,
          ];
        });
        const reviewDataInsertionString = format(
          `INSERT INTO reviews (title, designer, owner, review_img_url,review_body, category, created_at, votes) VALUES %L RETURNING *`,
          formattedReviewData
        );
        return db.query(reviewDataInsertionString);
      })
      //insert comments
      .then(() => {
        const formattedCommentData = commentData.map((comment) => {
          return [
            comment.body,
            comment.votes,
            comment.author,
            comment.review_id,
            comment.created_at,
          ];
        });
        const commentDataInsertionString = format(
          `INSERT INTO comments (body,votes,author,review_id,created_at) VALUES %L RETURNING *`,
          formattedCommentData
        );
        return db.query(commentDataInsertionString);
      })
  );
};

module.exports = seed;
