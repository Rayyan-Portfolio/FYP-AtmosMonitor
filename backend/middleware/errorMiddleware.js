function errorMiddleware(err, req, res, next) {
  // Log the full error stack for debugging purposes
  console.error(err.stack);

  // Respond with a 500 Internal Server Error and the error message
  res.status(500).json({ error: "Something went wrong!", details: err.message });
}

module.exports = errorMiddleware;
