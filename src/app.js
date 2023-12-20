const express = require("express");
const cors = require("cors");
const winston = require("winston");
const { combine, timestamp, json } = winston.format;
const planetRoute = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");
const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: ["GET", "PUT", "POST"],

// };
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  //   transports: [new winston.transports.Console()],
  transports: [
    new winston.transports.File({ filename: __dirname + "/logs.log" }),
  ],
});

app.use((req, res, next) => {
  logger.info(req.method);
  next();
});

app.use(express.json());

app.use("/planets", planetRoute);
app.use("/launches", launchesRouter);
app.use("/launches", launchesRouter);
app.use("/*", (req, res) => {
  res.send("<html><h1>Page Not Found</h1></html>");
});
module.exports = app;
