const launchesModel = require("../../models/launches.model");

const getLaunches = async function (req, res, next) {
  const page = Math.abs(req.query.page) || 1;
  const limit = Math.abs(req.query.limit) || 10;
  const launchesList = await launchesModel.getLaunchesList(page, limit);
  return res.status(200).json(launchesList);
};

const addNewLaunch = async function (req, res, next) {
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
  try {
    const savedLaunchObj = await launchesModel.scheduleLaunch(launchObj);
    return res.status(201).json(savedLaunchObj);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const abortLaunch = async function (req, res, next) {
  const flightId = req.params.id;
  try {
    const abortedLaunch = await launchesModel.abortLaunchById(Number(flightId));
    if (
      abortedLaunch &&
      abortedLaunch.matchedCount &&
      abortedLaunch.modifiedCount
    ) {
      return res.status(202).json({ message: "OK" });
    } else {
      return res
        .status(404)
        .json({ message: "abort launch was unsuccessful!!" });
    }
  } catch (err) {
    console.log("error caught");
    return res.status(404).json({ error: err.message });
  }
};
module.exports = {
  getLaunches,
  addNewLaunch,
  abortLaunch,
};
