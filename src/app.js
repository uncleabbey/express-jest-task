const express = require('express');
const routes = require('./routes');
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
};

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    error: "404 Page Not Found",
  });
});

app.use((error, req, res, next) => {
  const { status, error: err } = error;
  res.status(status);
  return res.json({
    status: "error",
    error: err,
  });
});

module.exports = app;