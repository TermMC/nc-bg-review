const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(
      `
    SELECT * FROM users 
    WHERE username=$1`,
      [username]
    )
    .then((response) => {
      if (response.rows.length !== 0) {
        return response.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "User Could Not Be Found",
        });
      }
    });
};
