const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return db
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
    .then(() => {
      return db.query(`CREATE TABLE categories (
        slug VARCHAR(100) PRIMARY KEY,
        description VARCHAR(300)
      ) `);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(200) PRIMARY KEY,
        avatar_url TEXT,
        name VARCHAR(250)
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(500),
        review_body TEXT,
        designer VARCHAR(250),
        review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(100) REFERENCES categories(slug),
        owner VARCHAR(200) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(200) REFERENCES users(username),
        review_id INT REFERENCES reviews(review_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body TEXT
      )`);
    })
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
    });

  //insert into reviews
  //insert into comments
};

module.exports = seed;
