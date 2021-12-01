const db = require("../db/connection");

exports.fetchComments = (review_id) => {
  console.log("I'm in mod");
  console.log(review_id);
  return db
    .query(`SELECT * FROM comments WHERE review_id = ${review_id}`)
    .then((response) => {
      return response.rows;
    });
};
