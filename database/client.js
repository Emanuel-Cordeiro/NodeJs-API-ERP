const { databaseTransaction } = require('./db');

async function selectCustomers() {
  const sql =
    'SELECT client_id,name, phone, address, district, number, city FROM client ORDER BY client_id';

  const result = await databaseTransaction(sql);

  return result;
}

async function selectCustomer(id) {
  const sql =
    'SELECT client_id,name, phone, address, district, number, city FROM client WHERE client_id = $1';

  const result = await databaseTransaction(sql, [id]);

  return result;
}

async function insertCustomer(customer) {
  const sql =
    'INSERT INTO client (name, phone, address, district, number, city) VALUES ($1, $2, $3, $4, $5, $6)';

  const args = [
    customer.name,
    customer.phone,
    customer.address,
    customer.district,
    customer.number,
    customer.city,
  ];

  await databaseTransaction(sql, args);

  const result = await databaseTransaction('SELECT MAX(client_id) FROM client');

  return result[0].max;
}

async function updateCustomer(customer) {
  const sql =
    'UPDATE client SET name = $1, phone = $2, address = $3, district = $4, number = $5, city = $6 WHERE client_id = $7';

  const args = [
    customer.name,
    customer.phone,
    customer.address,
    customer.district,
    customer.number,
    customer.city,
    customer.client_id,
  ];

  await databaseTransaction(sql, args);

  return customer.client_id;
}

async function deleteCustomer(id) {
  let sql = 'SELECT DISTINCT 1 FROM orders WHERE client_id = $1';

  const res = await databaseTransaction(sql, [id]);

  if (res[0]) {
    throw new Error('Cliente já possui pedidos, não pode ser excluído.');
  }

  sql = 'DELETE FROM client WHERE client_id = $1';

  await databaseTransaction(sql, [id]);

  return;
}

module.exports = {
  selectCustomers,
  selectCustomer,
  insertCustomer,
  updateCustomer,
  deleteCustomer,
};
