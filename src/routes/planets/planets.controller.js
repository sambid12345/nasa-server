const cluster = require("cluster");

const planetsModel = require("../../models/planets.model");

const getAllPlanets = async function (req, res, next) {
  const responseData = await planetsModel.readPlanetsData();

  // bocking code
  // let expiredTimer = new Date().getTime() + 5000;
  // while (new Date().getTime() < expiredTimer) {}

  return res.status(200).send(responseData);
};

module.exports.getAllPlanets = getAllPlanets;
