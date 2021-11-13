module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Firstcry@123",
  DB: "ticket_booking",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
