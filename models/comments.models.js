const db = require("../db/connection");
const { checkRecordExists } = require("./utils");

exports.fetchComments = (review_id) => {
  const checkReviewExists = checkRecordExists("review", review_id);

  const fetchTheComments = db.query(
    `
    SELECT *
    FROM comments 
    WHERE review_id = ${review_id}
    ORDER BY created_at 
    DESC`
  );
  return Promise.all([checkReviewExists, fetchTheComments]).then((response) => {
    if (response[0]) {
      return response[1].rows;
    } else {
      return Promise.reject({ status: 404, msg: "Review not found" });
    }
  });
};

// exports.createComment = (review_id, body, author) => {
//   if (body && author) {
//     console.log("I'm now in the model if block");
//     return db
//       .query(
//         `INSERT INTO comments (review_id, body, author) VALUES ($1,$2,$3) RETURNING *`,
//         [review_id, body, author]
//       )
//       .then((response) => {
//         return response.rows[0];
//       });
//   } else {
//     return Promise.reject({ status: 400, msg: "Invalid Data Provided" });
//   }
// };

exports.asyncCreateComment = async (review_id, body, author) => {
  if (body && author) {
    return db
      .query(
        `INSERT INTO comments (review_id, body,author) VALUES ($1,$2,$3) RETURNING *`,
        [review_id, body, author]
      )
      .then((response) => {
        return response.rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid Data Provided" });
  }
};

exports.removeComment = (comment_id) => {
  const commentExists = db.query(
    `SELECT * 
    FROM comments 
    WHERE comment_id = $1`,
    [comment_id]
  );
  const deleteTheComment = db.query(
    `DELETE FROM comments 
    WHERE comment_id=$1`,
    [comment_id]
  );

  return Promise.all([commentExists, deleteTheComment]).then((response) => {
    if (response[0].rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment Not Found" });
    } else {
      return response[0].rows;
    }
  });
};

exports.updateComment = (comment_id, update) => {
  let votes_inc;

  update.inc_votes ? (votes_inc = update.inc_votes) : (votes_inc = 0);

  if (typeof votes_inc !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Invalid Update Provided",
    });
  } else {
    return db
      .query(
        `UPDATE comments 
      SET votes =( 
        (SELECT votes 
          FROM comments 
          WHERE comment_id = $1 )
           + $2 ) 
      WHERE comment_id = $1 
      RETURNING *`,
        [comment_id, votes_inc]
      )
      .then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Comment Not Found" });
        } else {
          return res.rows[0];
        }
      });
  }
};
