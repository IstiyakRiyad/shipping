const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Middlewares
const middleware = require("./middleware");
const routes = require("./routes");

// ENV
const { COOKIE_SECRET, CLIENT_URL } = process.env;

// Create express App
const app = express();

// Setup Cookie parser
app.use(cookieParser(COOKIE_SECRET));

// Setup cors
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Setup express middlewares'
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup Middleware
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());

// Static
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Main Routes
app.use(`/api/v1`, routes);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Not Found and Error handler
app.use(middleware.notFoundError);
app.use(middleware.errorHandler);

module.exports = app;
