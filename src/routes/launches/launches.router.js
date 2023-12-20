const express = require("express");
const launchesRouter = express.Router();
const launchesController = require("./launches.controller");
launchesRouter.get("/", launchesController.getLaunches);
launchesRouter.post("/", launchesController.addNewLaunch);
launchesRouter.delete("/:id", launchesController.abortLaunch);

module.exports = launchesRouter;
