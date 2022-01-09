const { fetchCategories } = require("./categories.models");
const db = require("../db/connection");
const format = require("pg-format");

exports.fetchReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*,
      COUNT(comments.review_id) as comment_count 
      FROM comments 
      RIGHT JOIN reviews 
      ON reviews.review_id=comments.review_id 
      WHERE reviews.review_id = $1 
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid review ID",
        });
      } else {
        return review.rows[0];
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.updateReview = (review_id, update_content) => {
  let votes_inc;

  update_content.inc_votes
    ? (votes_inc = update_content.inc_votes)
    : (votes_inc = 0);

  if (typeof votes_inc !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid Update Provided" });
  } else {
    return db
      .query(
        `UPDATE reviews 
        SET votes = ( 
          (
          SELECT votes 
          FROM reviews 
          WHERE review_id = $1 
          ) 
          + $2 ) 
          WHERE review_id = $1 
          RETURNING *`,
        [review_id, votes_inc]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Invalid review ID",
          });
        } else {
          return result.rows[0];
        }
      });
  }
};

exports.fetchReviews = (category, sort_by = `created_at`, order = `desc`) => {
  let queryString;
  if (
    ![
      "owner",
      "title",
      "review_id",
      "review_body",
      "designer",
      "review_img_url",
      "category",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by) ||
    !["asc", "desc"].includes(order.toLowerCase())
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  } else {
    if (category) {
      queryString = format(
        `SELECT reviews.* ,
        COUNT(comments.review_id) as comment_count 
        FROM comments 
        RIGHT JOIN reviews 
        ON reviews.review_id=comments.review_id 
        WHERE category = %L 
        GROUP BY reviews.review_id 
        ORDER BY ${sort_by} ${order}`,
        [category]
      );
      const categoriesQuery = fetchCategories();
      return Promise.all([categoriesQuery, db.query(queryString)]).then(
        (res) => {
          const categories = res[0].map((category) => category.slug);
          if (categories.includes(category)) {
            return res[1].rows;
          } else {
            return Promise.reject({ status: 404, msg: "Invalid Search Term" });
          }
        }
      );
    } else {
      queryString = `SELECT reviews.*,
      COUNT(comments.review_id) as comment_count 
      FROM comments 
      RIGHT JOIN reviews 
      ON reviews.review_id=comments.review_id  
      GROUP BY reviews.review_id 
      ORDER BY ${sort_by} ${order}`;

      return db.query(queryString).then((res) => {
        return res.rows;
      });
    }
  }
};

exports.createReview = (review_data) => {
  const { owner, title, review_body, designer, category } = review_data;
  const update_list = [owner, title, review_body, designer, category];
  if (update_list.includes(undefined)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Update Provided",
    });
  } else {
    return db
      .query(
        `INSERT INTO reviews 
        (owner, title, review_body, designer, category) 
        VALUES ($1 , $2 , $3 , $4 , $5) 
        RETURNING *`,
        update_list
      )
      .then((response) => {
        return { ...response.rows[0], comment_count: 0 };
      });
  }
};
