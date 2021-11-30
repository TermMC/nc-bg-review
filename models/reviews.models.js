const db = require("../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*,COUNT(comments.review_id) as comment_count FROM comments RIGHT JOIN reviews ON reviews.review_id=comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid review ID" });
      } else {
        return review.rows[0];
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.updateReview = (review_id, update_content) => {
  const votes_inc = update_content.inc_votes;
  if (typeof votes_inc !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Update Provided" });
  } else {
    return db
      .query(
        `UPDATE reviews SET votes = ((SELECT votes FROM reviews WHERE review_id = $1)+$2)WHERE review_id = $1 RETURNING *`,
        [review_id, votes_inc]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Invalid review ID" });
        } else {
          return result.rows[0];
        }
      });
  }
};

exports.fetchReviews = (category) => {
  console.log("category", category);
  if (false) {
    //category && typeof category !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  } else {
    return db
      .query(
        `SELECT reviews.*,COUNT(comments.review_id) as comment_count FROM comments RIGHT JOIN reviews ON reviews.review_id=comments.review_id WHERE category = $1 GROUP BY reviews.review_id `,
        [category]
      )
      .then((response) => {
        if (false) {
          //response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "No reviews of that category",
          });
        } else {
          return review.rows;
        }
      });
  }
};
