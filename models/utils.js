const db = require("../db/connection");

exports.checkRecordExists = async (record, record_id) => {
  try {
    const result = await db.query(
      `SELECT * FROM ${record}s WHERE ${record}_id=$1`,
      [record_id]
    );

    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
