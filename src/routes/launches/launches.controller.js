const launchesModel = require("../../models/launches.model");

const getLaunches = function (req, res, next) {
  const launchesList = launchesModel.getLaunchesList();
  return res.status(200).json(launchesList);
};

const addNewLaunch = function (req, res, next) {
  const launchObj = req.body;
  if (
    !launchObj.mission ||
    !launchObj.rocket ||
    !launchObj.launchDate ||
    !launchObj.target
  ) {
    return res.status(400).json({ error: "Invalid Request" });
  }

  if (new Date(launchObj.launchDate)?.toString() === "Invalid Date") {
    return res.status(400).json({ error: "Invalid Launch Date" });
  }
  launchObj.launchDate = new Date(launchObj.launchDate);
  const savedLaunchObj = launchesModel.addToLaunch(launchObj);
  return res.status(201).json(savedLaunchObj);
};

const abortLaunch = async function (req, res, next) {
  const flightId = req.params.id;
  try {
    const abortedLaunch = await launchesModel.abortLaunchById(Number(flightId));
    return res.status(202).json(abortedLaunch);
  } catch (err) {
    console.log("error caught");
    return res.status(404).json({ error: "Launch not found" });
  }
};
module.exports = {
  getLaunches,
  addNewLaunch,
  abortLaunch,
};
