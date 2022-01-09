const db = require("../db/connection");

exports.checkRecordExists = async (record, record_id) => {
  try {
    //N.B. this util doesn't work for category as it has an irregular spelling, could add functionality for category via reference obj
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
