class DatabaseError extends Error {
  constructor(statusCode, message, status) {
    super(message);

    this.name = "DatabaseError";
    this.statusCode = statusCode;
    this.status = status;
  }
}

module.exports = {
  DatabaseError
};