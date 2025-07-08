const { databaseTransaction } = require('./db');

async function selectLogs(startingDate, endingDate) {
  const sql =
    'SELECT log_id, date, description, screen FROM log WHERE date <= $1 AND date >= $2 ORDER BY log_id';

  const result = await databaseTransaction(sql, [startingDate, endingDate]);
  console.log(result);
  return result;
}

async function insertLogs(log) {
  const sql = 'INSERT INTO log (date, description, screen) VALUES ($1, $2, $3)';

  const args = [log.date, log.description, log.screen];

  await databaseTransaction(sql, args);

  return;
}

module.exports = {
  selectLogs,
  insertLogs,
};
