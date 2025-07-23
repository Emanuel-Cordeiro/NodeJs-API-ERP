const { databaseTransaction } = require('./db');

async function selectLogs(startingDate, endingDate) {
  const sql =
    'SELECT log_id, date, description, screen FROM log WHERE date >= $1 AND date <= $2 ORDER BY log_id';

  const result = await databaseTransaction(sql, [startingDate, endingDate]);

  return result;
}

async function insertLogs(log) {
  const sql = 'INSERT INTO log (date, description, screen) VALUES ($1, $2, $3)';

  const currentDate = new Date().toISOString().split('T')[0];

  const args = [currentDate, log.description, log.screen];

  await databaseTransaction(sql, args);

  return;
}

const generateLog = async (description, screen) => {
  await insertLogs({
    description,
    screen,
  });
};

module.exports = {
  selectLogs,
  insertLogs,
  generateLog,
};
