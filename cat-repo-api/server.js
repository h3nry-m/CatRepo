const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { BadRequestError, NotFoundError } = require("./utils/errors");
const { PORT } = require("./config");
const authRoutes = require("./routes/auth");

const app = express();

// allows other origins to access this api
app.use(cors());

// parse incoming request bodies with JSON
app.use(express.json());

// log request info
app.use(morgan("tiny"));

app.use("/auth", authRoutes);

// if the endpoint doesn't match any endpoints - will call this middleware to send to NotFoundError
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// if reach this point then generic error handling
app.use((error, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
